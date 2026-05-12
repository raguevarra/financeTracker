import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/currentUser";
import { getAccountById } from "@/lib/accounts";
import { createBillForAccount } from "@/lib/bills";

export async function POST(request: Request) {
    // Try-catch for errors
    try {
        const body = await request.json();

        const { name, amount, dueDate, accountId } = body;

        if (!name || amount === undefined || !dueDate || !accountId) {
            return NextResponse.json(
                { error: "Missing required fields"},
                { status: 400 }
            );
        }

        const userId = await getCurrentUserId();

        const account = await getAccountById(accountId, userId);

        if (!account) {
            return NextResponse.json(
                { error: "Account not found or access denied" },
                { status: 400}
            );
        }

        const bill = await createBillForAccount({
            name,
            amount,
            dueDate,
            accountId,
        });

        return NextResponse.json(bill, { status: 201 });
    } catch (error) {
        console.error("Error creating bill:", error);

        return NextResponse.json(
            { error: "Failed to create bill."},
            { status: 500 }
        );
    }
}