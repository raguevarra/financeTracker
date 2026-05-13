import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/currentUser"
import { deleteBillById, getBillByIdForUser, updateBillById } from "@/lib/bills";

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
            return NextResponse.json(
                { error: "Bill not found or access denied." },
                { status: 404 }
            );
        }

        await deleteBillById(id);

        return NextResponse.json(
            { message: "Bill deleted successfully." },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting bill:", error);

        return NextResponse.json(
            { error: "Failed to delete bill."},
            { status: 500 }
        );
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
        return NextResponse.json(
            { error: "Bill not found." },
            { status: 404 }
        );
    }

    const updatedBill = await updateBillById(id, {
        name: body.name,
        amount: body.amount,
        dueDate: body.dueDate,
    });

    return NextResponse.json(updatedBill);
    
}