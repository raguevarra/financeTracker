/*
A collection of generic validators to avoid reuse
*/

export type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function isValidDateInput(value: unknown): value is string {
  if (!isNonEmptyString(value)) {
    return false;
  }

  const date = new Date(value);

  return !Number.isNaN(date.getTime());
}

export function isValidPositiveAmount(value: unknown): value is string | number {
  if (typeof value !== "string" && typeof value !== "number") {
    return false;
  }

  const amount = Number(value);

  return Number.isFinite(amount) && amount > 0;
}

export function isValidNumericAmount(value: unknown): value is string | number {
  if (typeof value !== "string" && typeof value !== "number") {
    return false;
  }

  const amount = Number(value);

  return Number.isFinite(amount);
}

export function toStringAmount(value: string | number) {
  return String(value);
}