/*
POST route to create a transfer between two accounts
*/
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getCurrentUserId } from "@/lib/getCurrentUser";
import { getAccountById } from "@/lib/accounts";
import { createTransferBetweenAccounts } from "@/lib/transfers";
import { badRequest, notFound, serverError } from "@/lib/responses";
import { validateCreateTransferInput } from "@/lib/validation/transfers";

export async function POST(request: Request) {
    // Try-catch block to handle potential errors during transfer creation
    try {
        // Parse the incoming request body as JSON
        const body = await request.json();

        // JSON request validation
        const validation = validateCreateTransferInput(body);

        if (!validation.ok) {
            return badRequest(validation.error);
        }

        // Destructure required fields from the validated request body
        const { fromAccountId, toAccountId, amount, date, name } = validation.data;

        const userId = await getCurrentUserId();

        // Fetch both accounts for the current user to confirm they exist and are accessible
        const fromAccount = await getAccountById(fromAccountId, userId);
        const toAccount = await getAccountById(toAccountId, userId);

        // If either account does not exist, return a 404 error response
        if (!fromAccount || !toAccount) {
            return notFound("Account not found or access denied.");
        }

        // Create the transfer and its account transactions in the database using Prisma
        const transfer = await createTransferBetweenAccounts({
            fromAccountId,
            toAccountId,
            amount,
            date,
            name
        });

        // Revalidate affected pages so cached balances and transactions stay current
        revalidatePath("/");
        revalidatePath(`/accounts/${fromAccountId}`);
        revalidatePath(`/accounts/${toAccountId}`);

        // Return the created transfer as a JSON response with a 201 status code
        return NextResponse.json(transfer, { status: 201 });
    } catch (error) {
        // Log the error to the console for debugging purposes
        console.error("Error creating transfer:", error);

        if (error instanceof Error) {
            // If both account IDs match, return a 400 error response
            if (error.message === "SAME_ACCOUNT_TRANSFER") {
                return badRequest("Cannot transfer to the same account.");
            }

            // If an account is missing during transfer creation, return a 404 error response
            if (error.message === "ACCOUNT_NOT_FOUND") {
                return notFound("Account not found or access denied.");
            }
        }

        // Return a generic error response with a 500 status code if something goes wrong
        return serverError("Failed to create transfer.");
    }
}
