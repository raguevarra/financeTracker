import {
    isNonEmptyString,
    isObject,
    isValidDateInput,
    isValidPositiveAmount,
    toStringAmount,
    type ValidationResult,
} from "./shared"

const TRANSACTION_TYPES = ["DEBIT", "CREDIT", "TRANSFER"] as const;

type TransactionType = (typeof TRANSACTION_TYPES)[number];

export type ValidTransactionInput = {
    name: string;
    amount: string;
    type: TransactionType;
    date: string;
    accountId: string;
};

function isTransactionType(value: unknown): value is TransactionType {
    return typeof value === "string" && TRANSACTION_TYPES.includes(value as TransactionType);
}

function validateTransactionInput(
    body: unknown
): ValidationResult<ValidTransactionInput> {
    if (!isObject(body)) {
        return { ok: false, error: "Invalid request body." };
    }

    const { name, amount, type, date, accountId } = body;

    if (!isNonEmptyString(name)) {
        return { ok: false, error: "Transaction name is required." };
    }

    if (!isValidPositiveAmount(amount)) {
        return { ok: false, error: "Transaction amount must be greater than 0." };
    }

    if (!isTransactionType(type)) {
        return { ok: false, error: "Invalid transaction type." };
    }

    if (!isValidDateInput(date)) {
        return { ok: false, error: "Transaction date is required." };
    }

    if (!isNonEmptyString(accountId)) {
        return { ok: false, error: "Account is required." };
    }

    return {
        ok: true,
        data: {
            name: name.trim(),
            amount: toStringAmount(amount),
            type,
            date,
            accountId,
        },
    };
}

export function validateCreateTransactionInput(body: unknown) {
    return validateTransactionInput(body);
}

export function validateUpdateTransactionInput(body: unknown) {
    return validateTransactionInput(body);
}