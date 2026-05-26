/*
GET route to fetch dashboard information for a household
*/
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notFound } from "@/lib/responses";

type RouteParams = {
    params: Promise<{
        householdId: string;
    }>;
};
  
export async function GET(_request: NextRequest, { params }: RouteParams) {
    // Extract the household ID from the route params
    const { householdId } = await params;

    // Fetch the household with members, accounts, owners, and recent transactions
    const household = await prisma.household.findUnique({
        where: { id: householdId },
        include: {
            members: {
                include: {
                    user: true,
                },
            },
            accounts: {
                include: {
                    owner: true,
                    transactions: {
                        orderBy: {
                            date: "desc",
                        },
                        take: 5,
                    },
                },
            },
        },
    });

    // If the household does not exist, return a 404 error response
    if (!household) {
        return notFound("Household not found.");
    }

    // Calculate the total balance across all household accounts
    const totalBalance = household.accounts.reduce((total, account) => {
        return total + Number(account.balance);
    }, 0);

    // Flatten, sort, and limit recent transactions across all household accounts
    const recentTransactions = household.accounts
        .flatMap(
            (account) =>
                account.transactions.map((transaction) => ({
                    ...transaction,
                    accountName: account.name,
            })
        )
    ).sort(
        (a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
    ).slice(0, 5);

    // Return the household dashboard data as a JSON response
    return NextResponse.json({
        household: {
            id: household.id,
            name: household.name,
        },
        members: household.members,
        accounts: household.accounts.map((account) => ({
            id: account.id,
            name: account.name,
            type: account.type,
            balance: account.balance,
            owner: account.owner,
        })),
        totalBalance,
        recentTransactions,
    });
}
