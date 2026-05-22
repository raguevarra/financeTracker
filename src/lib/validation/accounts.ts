import {
    isNonEmptyString,
    isObject,
    isValidNumericAmount,
    toStringAmount,
    type ValidationResult,
} from "./shared";

const ACCOUNT_TYPES = ["CHEQUING", "SAVINGS", "CREDIT", "CASH", "OTHER"] as const;

type AccountType = (typeof ACCOUNT_TYPES)[number];

export type ValidCreateAccountInput = {
    name: string;
    type: AccountType;
    balance: string;
}

function isAccountType(value: unknown): value is AccountType {
    return typeof value === "string" && ACCOUNT_TYPES.includes (value as AccountType);
}

export function validateCreateAccountInput(
    body: unknown
): ValidationResult<ValidCreateAccountInput> {
    if (!isObject(body)) {
        return { ok : false, error: "Invalid request body." };
    }

    const { name, type, balance } = body;

    if (!isNonEmptyString(name)) {
        return { ok: false, error: "Account name is required." };
    }

    if (!isAccountType(type)) {
        return { ok: false, error: "Invalid account type." };
    }

    if (!isValidNumericAmount(balance)) {
        return { ok: false, error: "Account balance must be a valid number." };
    }

    return {
        ok: true,
        data: {
            name: name.trim(),
            type,
            balance: toStringAmount(balance),
        },
    };
}