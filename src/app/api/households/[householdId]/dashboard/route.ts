import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteParams = {
    params: Promise<{
        householdId: string;
    }>;
};
  
export async function GET(_request: NextRequest, { params }: RouteParams) {
    const { householdId } = await params;

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

    if (!household) {
        return NextResponse.json(
            { error: "Household not found" },
            { status: 404 }
        );
    }

    const totalBalance = household.accounts.reduce((total, account) => {
        return total + Number(account.balance);
    }, 0);

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