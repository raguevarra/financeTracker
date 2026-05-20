import { Prisma } from "@prisma/client";

export async function incrementAccountBalance(
    tx: any,
    accountId: string,
    amount: Prisma.Decimal
) {
    return tx.account.update({
        where: { id: accountId },
        data: {
            balance: {
                increment: amount,
            },
        },
    });
}