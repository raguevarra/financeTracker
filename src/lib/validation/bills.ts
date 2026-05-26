import {
  isNonEmptyString,
  isObject,
  isValidDateInput,
  isValidPositiveAmount,
  toStringAmount,
  type ValidationResult,
} from "./shared";

export type ValidCreateBillInput = {
  name: string;
  amount: string;
  dueDate: string;
  accountId: string;
};

export type ValidUpdateBillInput = {
  name: string;
  amount: string;
  dueDate: string;
};

export function validateCreateBillInput(
  body: unknown
): ValidationResult<ValidCreateBillInput> {
  if (!isObject(body)) {
    return { ok: false, error: "Invalid request body." };
  }

  const { name, amount, dueDate, accountId } = body;

  if (!isNonEmptyString(name)) {
    return { ok: false, error: "Bill name is required." };
  }

  if (!isValidPositiveAmount(amount)) {
    return { ok: false, error: "Bill amount must be greater than 0." };
  }

  if (!isValidDateInput(dueDate)) {
    return { ok: false, error: "Bill due date is required." };
  }

  if (!isNonEmptyString(accountId)) {
    return { ok: false, error: "Account is required." };
  }

  return {
    ok: true,
    data: {
      name: name.trim(),
      amount: toStringAmount(amount),
      dueDate,
      accountId,
    },
  };
}

export function validateUpdateBillInput(
  body: unknown
): ValidationResult<ValidUpdateBillInput> {
  if (!isObject(body)) {
    return { ok: false, error: "Invalid request body." };
  }

  const { name, amount, dueDate } = body;

  if (!isNonEmptyString(name)) {
    return { ok: false, error: "Bill name is required." };
  }

  if (!isValidPositiveAmount(amount)) {
    return { ok: false, error: "Bill amount must be greater than 0." };
  }

  if (!isValidDateInput(dueDate)) {
    return { ok: false, error: "Bill due date is required." };
  }

  return {
    ok: true,
    data: {
      name: name.trim(),
      amount: toStringAmount(amount),
      dueDate,
    },
  };
}