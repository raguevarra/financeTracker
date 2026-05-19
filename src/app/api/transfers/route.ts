import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getCurrentUserId } from "@/lib/currentUser";
import { getAccountById } from "@/lib/accounts";
import { createTransferBetweenAccounts } from "@/lib/transactions";
import { create } from "node:domain";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { fromAccountId, toAccountId, amount, date, name } = body;

        if (!fromAccountId || !toAccountId || amount === undefined || !date) {
            return NextResponse.json(
                { error: "Missing required fields." },
                { status: 400 }
            );
        }

        if (fromAccountId === toAccountId) {
            return NextResponse.json(
                { error: "Cannot transfer to the same account." },
                { status: 400 }
            );
        }

        const userId = await getCurrentUserId();

        const fromAccount = await getAccountById(fromAccountId, userId);
        const toAccount = await getAccountById(toAccountId, userId);

        if (!fromAccount || !toAccount) {
            return NextResponse.json(
                { error: "Account not found or access denied." },
                { status: 404}
            );
        }

        const transfer = await createTransferBetweenAccounts({
            fromAccountId,
            toAccountId,
            amount,
            date,
            name
        });

        revalidatePath("/");
        revalidatePath(`/accounts/${fromAccountId}`);
        revalidatePath(`/accounts/${toAccountId}`);

        return NextResponse.json(transfer, { status: 201 });
    } catch (error) {
        console.error("Error creating transfer:", error);

        return NextResponse.json(
            { error: "Failed to create transfer." },
            { status: 500 }
        );
    }
}