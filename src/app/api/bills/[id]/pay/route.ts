/*
POST route to mark an existing bill as paid
*/
import { NextResponse } from "next/server";
import { getBillByIdForUser, payBillById } from "@/lib/bills";
import { getCurrentUserId } from "@/lib/currentUser";
import { revalidatePath } from "next/cache";
import { notFound, serverError, badRequest } from "@/lib/responses";

export async function POST(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    // Extract the bill ID from the route params
    const { id } = await params;
    const userId = await getCurrentUserId();

    // Fetch the bill for the current user to confirm it exists and is accessible
    const bill = await getBillByIdForUser(id, userId);

    // If the bill does not exist, return a 404 error response
    if (!bill) {
        return notFound("Bill not found or access denied.");
    }

    // Try-catch block to handle potential errors during bill payment
    try {
        // Mark the bill as paid in the database using Prisma
        const result = await payBillById(id);

        // Revalidate the account page so cached totals and bills stay current
        revalidatePath(`/accounts/${result.bill.accountId}`);

        // Return the paid bill result as a JSON response
        return NextResponse.json(result);
    } catch (error) {
        // If the bill was already paid, return a 400 error response
        if (error instanceof Error && error.message === "BILL_ALREADY_PAID") {
            return badRequest("Bill is already paid.");
        }

        // If the bill disappears during payment, return a server error response
        if (error instanceof Error && error.message === "BILL_NOT_FOUND") {
            return serverError("Bill not found.");
        }

        // Return a generic error response with a 500 status code if something goes wrong
        return serverError("Failed to pay bill.");
    }
}
