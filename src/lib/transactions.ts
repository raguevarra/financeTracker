import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type CreateTransactionInput = {
    name: string;
    amount: string;
    type: string;
    date: string;
    accountId: string;
}

type UpdateTransactionInput = {
    name: string;
    amount: string;
    type: string;
    date: string;
    accountId: string;
}

type CreateTransferInput = {
    fromAccountId: string;
    toAccountId: string;
    amount: string;
    date: string;
    name?: string;
};

function normalizeTransactionAmount(amount: string, type: string) {
    const decimalAmount = new Prisma.Decimal(amount);

    if (type === "DEBIT") {
        return decimalAmount.abs().negated();
    }

    if (type === "CREDIT") {
        return decimalAmount.abs();
    }

    return decimalAmount;
}

export async function createTransactionForAccount({
    name,
    amount,
    type,
    date,
    accountId,
}: CreateTransactionInput) {
    const decimalAmount = normalizeTransactionAmount(amount, type);

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

export async function getTransactionByIdForUser(
    transactionId: string,
    userId: string
) {
    return prisma.transaction.findFirst({
        where: {
            id: transactionId,
            account: {
                OR: [
                    { ownerId: userId },
                    { 
                        household: {
                            members: {
                                some: {
                                    userId
                                },
                            },
                        },
                    },
                ],
            },
        },
    });
}

export async function updateTransactionById(
    transactionId: string,
    { name, amount, type, date, accountId }: UpdateTransactionInput
) {
    const newAmount = normalizeTransactionAmount(amount, type);

    return prisma.$transaction(async (tx) => {
        const existingTransaction = await tx.transaction.findUnique({
            where: {
                id: transactionId,
            },
        });

        if (!existingTransaction) {
            throw new Error("TRANSACTION_NOT_FOUND");
        }

        const oldAmount = existingTransaction.amount;
        const oldAccountId = existingTransaction.accountId;

        const updatedTransaction = await tx.transaction.update({
            where: {
                id: transactionId,
            },
            data : {
                name,
                amount: newAmount,
                type,
                date: new Date(date),
                accountId,
            },
        });

        if (oldAccountId === accountId) {
            await tx.account.update({
                where: {
                    id: accountId,
                },
                data: {
                    balance: {
                        increment: newAmount.minus(oldAmount),
                    },
                },
            });
        } else {
            await tx.account.update({
                where: {
                    id: oldAccountId,
                },
                data: {
                    balance: {
                        decrement: oldAmount,
                    },
                },
            });

            await tx.account.update({
                where: {
                    id: accountId,
                },
                data: {
                    balance: {
                        increment: newAmount
                    },
                },
            });
        }

        return updatedTransaction;
    });
}

export async function deleteTransactionById(transactionId: string) {
    return prisma.$transaction(async (tx) => {
        const existingTransaction = await tx.transaction.findUnique({
            where: {
                id: transactionId,
            },
        });

        if (!existingTransaction) {
            throw new Error("TRANSACTION_NOT_FOUND");
        }

        await tx.transaction.delete({
            where: {
                id:transactionId,
            },
        });

        await tx.account.update({
            where: {
                id: existingTransaction.accountId,
            },
            data: {
                balance: {
                    decrement: existingTransaction.amount,
                },
            },
        });

        return existingTransaction;
    });
}