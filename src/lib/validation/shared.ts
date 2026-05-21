/*
A collection of generic validators to avoid reuse
*/

export function isNonEmptyString(value: unknown): value is string {
    return typeof value === "string" && value.trim().length > 0;
}

export function isValidAmount(value: unknown) {
    if (typeof value !== "string" && typeof value !== "number") {
        return false;
    }

    const amount = Number(value);
    return Number.isFinite(amount) && amount > 0;
}

export function isValidDateInput(value: unknown): value is string {
    if (typeof value !== "string" || !value) {
        return false;
    }

    const date = new Date(value);
    return !Number.isNaN(date.getTime());
}