import { prisma } from "./prisma";
import { Prisma } from "@prisma/client";
import { accountAccessWhere } from "./access";

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
            ...accountAccessWhere(userId),
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

export async function getAccountsForUser(
    userId: string,
    options?: { archived?: boolean }
    ) {
        const archived = options?.archived ?? false;
        
        const accounts = await prisma.account.findMany({
            where: {
                isArchived: archived,
                ...accountAccessWhere(userId),
            },
            orderBy: {
                name: "asc",
            },
            select: {
                id: true,
                name: true,
                type: true,
                balance: true,
                isArchived: true,
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

export async function archiveAccountForUser({
    accountId,
    userId,
    isArchived,
} : {
    accountId: string;
    userId: string;
    isArchived: boolean;
}) {
    const account = await prisma.account.findFirst({
        where: {
            id: accountId,
            OR: [
                { ownerId: userId},
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
    });

    if (!account) {
        return null;
    }

    return prisma.account.update({
        where: {
            id: accountId,
        },
        data: {
            isArchived,
        },
    });
}