// Route for dashboard information
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const userId = "cmoux9ags0001miuw355jprfw";

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
        include: {
            transactions: {
                orderBy: {
                    date: "desc",
                },
            },
        },
    });

    const totalBalance = accounts.reduce((sum, account) => {
        return sum + Number(account.balance);
    }, 0);

    const allTransactions = accounts.flatMap((account) => account.transactions);

    const recentTransactions = allTransactions
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 5);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const monthlySpending = allTransactions
        .filter((transaction) => {
            return (
                transaction.date >= startOfMonth &&
                Number(transaction.amount) < 0
            );
        })
        .reduce((sum, transaction) => {
            return sum + Math.abs(Number(transaction.amount));
        }, 0);

    return NextResponse.json({
        totalBalance,
        monthlySpending,
        recentTransactions,
        accounts,
    });
}