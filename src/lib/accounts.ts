import { prisma } from "./prisma";

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
        },
    });

    return accounts;
}