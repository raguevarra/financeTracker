// Contains functions for the dashboard page to clean up the route

// Imports
import { prisma } from "@/lib/prisma";

export async function getDashboardData(userId: string) {
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
            bills: {
                orderBy: {
                    dueDate: "asc",
                },
            },
        },
    });

    // Total Balance Calculation
    const totalBalance = accounts.reduce((sum, account) => {
        return sum + Number(account.balance);
    }, 0);

    // Get all account transactions
    const allTransactions = accounts.flatMap((account) => account.transactions);

    // Get only recent transactions
    const recentTransactions = allTransactions
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 5);

    // Get the start of the month from today
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get monthly spending from transactions
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

    const upcomingBills = accounts
        .flatMap((account) => account.bills)
        .filter((bill) => !bill.isPaid)
        .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
        .slice(0, 5);

    return {
        totalBalance,
        monthlySpending,
        recentTransactions,
        accounts,
        upcomingBills,
    };
}