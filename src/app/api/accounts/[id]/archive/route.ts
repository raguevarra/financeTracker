/*
PATCH route to update an account's archived status
*/
import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/currentUser";
import { archiveAccountForUser } from "@/lib/accounts"
import { badRequest, notFound, serverError } from "@/lib/responses";

type Params = {
    params: Promise<{ id: string}>;
};

export async function PATCH(request: Request, { params }: Params) {
    // Try-catch block to handle potential errors during account archive updates
    try {
        // Extract the account ID from the route params
        const { id } = await params;

        // Parse the incoming request body as JSON
        const body = await request.json();
        const { isArchived } = body;

        // Validate that the archived flag is a boolean
        if (typeof isArchived !== "boolean") {
            return badRequest("isArchived must be a boolean.");
        }

        const userId = await getCurrentUserId();

        // Update the account's archived status for the current user
        const account = await archiveAccountForUser({
            accountId: id,
            userId,
            isArchived,
        });

        // If the account does not exist, return a 404 error response
        if (!account) {
            return notFound("Account not found.");
        }

        // Return the updated account as a JSON response
        return NextResponse.json(account);
    } catch (error) {
        // Log the error to the console for debugging purposes
        console.error("Error updating account archive status.", error);

        // Return a generic error response with a 500 status code if something goes wrong
        return serverError("Failed to update account archive status.");
    }
}
