// Add new transaction using POST
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { getCurrentUserId } from "@/lib/currentUser";
import { prisma } from "@/lib/prisma";


export async function POST(request: Request) {
    // Try-catch block to handle potential errors during transaction creation
    try {
        // Parse the incoming request body as JSON
        const body = await request.json();
        
        // Destructure required fields from the request body
        const { name, amount, type, date, accountId } = body;

        // Validate that all required fields are present
        if (!name || amount === undefined || !type || !date || !accountId) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const userId = await getCurrentUserId();
        
        // Check if the specified account exists before creating the transaction
        const account = await prisma.account.findFirst({
            where: {
                id: accountId,
                userId,
            },
        });

        // If the account does not exist, return a 404 error response
        if (!account) {
            return NextResponse.json(
                { error: "Account not found" },
                { status: 404 }
            );
        }
        
        // Create a new transaction in the database using Prisma
        const transaction = await prisma.transaction.create({
            data: {
                name,
                amount: new Prisma.Decimal(amount),
                type,
                date: new Date(date),
                accountId,
            },
        });

        // Return the created transaction as a JSON response with a 201 status code
        return NextResponse.json(transaction, { status: 201 });
    } catch (error) {
        // Log the error to the console for debugging purposes
        console.error("Error creating transaction:", error);

        // Return a generic error response with a 500 status code if something goes wrong
        return NextResponse.json(
            { error: "Failed to create the transaction." },
            { status: 500 }
        );
    }    
}