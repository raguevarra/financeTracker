/*
DELETE route to delete an existing bill
PATCH route to update an existing bill
*/
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getCurrentUserId } from "@/lib/getCurrentUser"
import { deleteBillById, getBillByIdForUser, updateBillById } from "@/lib/bills";
import { notFound, serverError, badRequest } from "@/lib/responses";
import { validateUpdateBillInput } from "@/lib/validation/bills";

type RouteParams = {
    params: Promise<{
        id: string,
    }>;
};

export async function DELETE(_request: Request, { params }: RouteParams) {
    // Try-catch block to handle potential errors during bill deletion
    try {
        // Extract the bill ID from the route params
        const { id } = await params;

        const userId = await getCurrentUserId();

        // Fetch the bill for the current user to confirm it exists and is accessible
        const bill = await getBillByIdForUser(id, userId);

        // If the bill does not exist, return a 404 error response
        if (!bill) {
            return notFound("Bill not found or access denied.");
        }

        // Delete the bill from the database using Prisma
        await deleteBillById(id);

        // Revalidate paths
        revalidatePath("/bills");
        revalidatePath("/");

        // Return a success message as a JSON response
        return NextResponse.json(
            { message: "Bill deleted successfully." },
            { status: 200 }
        );
    } catch (error) {
        // Log the error to the console for debugging purposes
        console.error("Error deleting bill:", error);

        // Return a generic error response with a 500 status code if something goes wrong
        return serverError("Failed to delete bill.");
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    // Extract the bill ID from the route params
    const { id } = await params;

    // Parse the incoming request body as JSON
    const body = await request.json();

    // JSON request validation
    const validation = validateUpdateBillInput(body);

    if (!validation.ok) {
        return badRequest(validation.error);
    }

    // Destructure required fields from the validated request body
    const { name, amount, dueDate } = validation.data

    const userId = await getCurrentUserId();

    // Fetch the bill for the current user to confirm it exists and is accessible
    const bill = await getBillByIdForUser(id, userId);

    // If the bill does not exist, return a 404 error response
    if (!bill) {
        return notFound("Bill not found or access denied.");
    }

    // Update the bill in the database using Prisma
    const updatedBill = await updateBillById(id, {
        name,
        amount,
        dueDate,
    });

    // Revalidate the account page so cached totals and bills stay current
    revalidatePath("/bills");
    revalidatePath("/");

    // Return the updated bill as a JSON response
    return NextResponse.json(updatedBill);
    
}
