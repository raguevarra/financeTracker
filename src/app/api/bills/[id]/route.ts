import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getCurrentUserId } from "@/lib/currentUser"
import { deleteBillById, getBillByIdForUser, updateBillById } from "@/lib/bills";
import { notFound, serverError } from "@/lib/responses";

type RouteParams = {
    params: Promise<{
        id: string,
    }>;
};

export async function DELETE(_request: Request, { params }: RouteParams) {
    try {
        const { id } = await params;

        const userId = await getCurrentUserId();

        const bill = await getBillByIdForUser(id, userId);

        if (!bill) {
            notFound("Bill not found or access denied.");
        }

        await deleteBillById(id);

        return NextResponse.json(
            { message: "Bill deleted successfully." },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting bill:", error);

        return serverError("Failed to delete bill.");
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const body = await request.json();

    const userId = await getCurrentUserId();

    const bill = await getBillByIdForUser(id, userId);

    if (!bill) {
        return notFound("Bill not found or access denied.");
    }

    const updatedBill = await updateBillById(id, {
        name: body.name,
        amount: body.amount,
        dueDate: body.dueDate,
    });

    revalidatePath(`/accounts/${updatedBill.accountId}`);

    return NextResponse.json(updatedBill);
    
}