// Add new transaction using POST
import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/currentUser";
import { getAccountById } from "@/lib/accounts";
import { createTransactionForAccount } from "@/lib/transactions";
import { badRequest, notFound, serverError } from "@/lib/responses";


export async function POST(request: Request) {
    // Try-catch block to handle potential errors during transaction creation
    try {
        // Parse the incoming request body as JSON
        const body = await request.json();
        
        // Destructure required fields from the request body
        const { name, amount, type, date, accountId } = body;

        // Validate that all required fields are present
        if (!name || amount === undefined || !type || !date || !accountId) {
            return badRequest("Missing required fields.");
        }

        const userId = await getCurrentUserId();
        
        const account = await getAccountById(accountId, userId);

        // If the account does not exist, return a 404 error response
        if (!account) {
            return notFound("Account not found or access denied.");
        }
        
        // Create a new transaction in the database using Prisma
        const transaction = await createTransactionForAccount({
            name,
            amount,
            type,
            date,
            accountId
        });

        // Return the created transaction as a JSON response with a 201 status code
        return NextResponse.json(transaction, { status: 201 });
    } catch (error) {
        // Log the error to the console for debugging purposes
        console.error("Error creating transaction:", error);

        // Return a generic error response with a 500 status code if something goes wrong
        return serverError("Failed to create transaction.");
    }    
}