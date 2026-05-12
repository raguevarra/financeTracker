import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/currentUser"
import { deleteBillById, getBillByIdForUser } from "@/lib/bills";

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