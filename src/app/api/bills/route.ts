import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/currentUser";
import { getAccountById } from "@/lib/accounts";
import { createBillForAccount } from "@/lib/bills";
import { badRequest, notFound, serverError } from "@/lib/responses";

export async function POST(request: Request) {
    // Try-catch for errors
    try {
        const body = await request.json();

        const { name, amount, dueDate, accountId } = body;

        if (!name || amount === undefined || !dueDate || !accountId) {
            return badRequest("Missing required fields.");
        }

        const userId = await getCurrentUserId();

        const account = await getAccountById(accountId, userId);

        if (!account) {
            return notFound("Account not found or access denied.");
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

        return serverError("Failed to create bill.");
    }
}