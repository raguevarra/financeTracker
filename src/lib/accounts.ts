import { prisma } from "./prisma";
import { Prisma } from "@prisma/client";

type CreateAccountInput = {
    name: string;
    type: string;
    balance: string;
    ownerId: string;
};

export async function getAccountById(accountId: string, userId: string) {
    const account = await prisma.account.findFirst({
        where: {
            id: accountId,
            OR: [
                { ownerId: userId },
                {
                    household: {
                        members: {
                            some: {
                                userId,
                            },
                        },
                    },
                },
            ],
        },
        include: {
            transactions: {
                orderBy: {
                    date: "desc",
                },
            },
            bills: {
                orderBy: {
                    dueDate: "asc",
                },
            },
        },
    });

    return account;
}

export async function getAccountsForUser(userId: string) {
    const accounts = await prisma.account.findMany({
        where: {
            OR: [
                { ownerId: userId },
                {
                    household: {
                        members: {
                            some: {
                                userId,
                            },
                        },
                    },
                },
            ],
        },
        orderBy: {
            name: "asc",
        },
        select: {
            id: true,
            name: true,
            type: true,
            balance: true,
        },
    });

    return accounts;
}

export async function createAccountForUser({
    name,
    type,
    balance,
    ownerId,
}: CreateAccountInput) {
    return prisma.account.create({
        data: {
            name,
            type,
            balance: new Prisma.Decimal(balance),
            ownerId,
        },
    });
}