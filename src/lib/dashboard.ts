// Contains functions for the dashboard page to clean up the route

// Imports
import { prisma } from "@/lib/prisma";

export async function getDashboardData(userId: string) {
    const accounts = await prisma.account.findMany({
        where: {
            isArchived: false,
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
                Number(transaction.amount) < 0 &&
                transaction.type != "TRANSFER"
            );
        })
        .reduce((sum, transaction) => {
            return sum + Math.abs(Number(transaction.amount));
        }, 0);

    // Get three days from now
    const threeDaysFromNow = new Date(now);
    threeDaysFromNow.setDate(now.getDate() + 3);
    threeDaysFromNow.setHours(23, 59, 59, 999);

    // Get bills that are due within the next 3 days
    const upcomingBills = accounts
        .flatMap((account) => account.bills)
        .filter((bill) =>{
            return !bill.isPaid && bill.dueDate <= threeDaysFromNow;
        })
        .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

    return {
        totalBalance,
        monthlySpending,
        recentTransactions,
        accounts,
        upcomingBills,
    };
}