export function validateCreateTransactionBody(body: any) {
    const { name, amount, type, date, accountId } = body;

    if (!name || amount === undefined || !type || !date || !accountId) {
        return { valid: false, error: "Missing required fields."}
    }

    return {
        valid: true,
        data: { name, amount, type, date, accountId },
    };
}