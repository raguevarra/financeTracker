import { NextResponse } from "next/server";
import { getBillByIdForUser, payBillById } from "@/lib/bills";
import { getCurrentUserId } from "@/lib/currentUser";

const userId = await getCurrentUserId();

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const bill = await getBillByIdForUser(id, userId);

    if (!bill) {
        return NextResponse.json(
            { error: "Bill not found." },
            { status: 404}
        );
    }

    try {
        const result = await payBillById(id);

        return NextResponse.json(result);
    } catch (error) {
        if (error instanceof Error && error.message === "BILL_ALREADY_PAID") {
            return NextResponse.json(
                { error: "Bill already paid." },
                { status: 400 }
            );
        }

        if (error instanceof Error && error.message === "BILL_NOT_FOUND") {
            return NextResponse.json(
                { error: "Bill not found." },
                { status: 404}
            );
        }

        return NextResponse.json(
            { error: "Failed to pay bill." },
            { status: 500 }
        );
    }
}