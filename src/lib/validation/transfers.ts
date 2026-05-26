import {
  isNonEmptyString,
  isObject,
  isValidDateInput,
  isValidPositiveAmount,
  toStringAmount,
  type ValidationResult,
} from "./shared";

export type ValidCreateTransferInput = {
  fromAccountId: string;
  toAccountId: string;
  amount: string;
  date: string;
  name?: string;
};

export function validateCreateTransferInput(
  body: unknown
): ValidationResult<ValidCreateTransferInput> {
  if (!isObject(body)) {
    return { ok: false, error: "Invalid request body." };
  }

  const { fromAccountId, toAccountId, amount, date, name } = body;

  if (!isNonEmptyString(fromAccountId)) {
    return { ok: false, error: "Source account is required." };
  }

  if (!isNonEmptyString(toAccountId)) {
    return { ok: false, error: "Destination account is required." };
  }

  if (fromAccountId === toAccountId) {
    return { ok: false, error: "Cannot transfer to the same account." };
  }

  if (!isValidPositiveAmount(amount)) {
    return { ok: false, error: "Transfer amount must be greater than 0." };
  }

  if (!isValidDateInput(date)) {
    return { ok: false, error: "Transfer date is required." };
  }

  if (name !== undefined && typeof name !== "string") {
    return { ok: false, error: "Transfer note must be text." };
  }

  return {
    ok: true,
    data: {
      fromAccountId,
      toAccountId,
      amount: toStringAmount(amount),
      date,
      name: isNonEmptyString(name) ? name.trim() : undefined,
    },
  };
}