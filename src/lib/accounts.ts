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
        },
    });

    return account;
}