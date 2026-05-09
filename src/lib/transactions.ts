import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type CreateTransactionInput = {
    name: string;
    amount: string;
    type: string;
    date: string;
    accountId: string;
}

export async function createTransactionForAccount({
    name,
    amount,
    type,
    date,
    accountId,
}: CreateTransactionInput) {
    const decimalAmount = new Prisma.Decimal(amount);

    return prisma.$transaction(async (tx) => {
        const transaction = await tx.transaction.create({
            data: {
                name,
                amount: decimalAmount,
                type,
                date: new Date(date),
                accountId,
            },
        });

        await tx.account.update({
            where: { id: accountId },
            data: {
                balance: {
                    increment: decimalAmount,
                },
            },
        });

        return transaction;
    });
}