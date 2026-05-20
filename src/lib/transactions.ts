import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { nestedAccountAccessWhere } from "./access";
import { adjustAccountBalance } from "./accountBalances";

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

        await adjustAccountBalance(tx, accountId, decimalAmount);

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
            ...nestedAccountAccessWhere(userId),
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
            await adjustAccountBalance(
                tx,
                accountId,
                newAmount.minus(oldAmount)
            );
        } else {
            await adjustAccountBalance(
                tx,
                oldAccountId,
                oldAmount.negated()
            );

            await adjustAccountBalance(
                tx,
                accountId,
                newAmount
            );
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

        await adjustAccountBalance(
            tx,
            existingTransaction.accountId,
            existingTransaction.amount.negated()
        );

        return existingTransaction;
    });
}