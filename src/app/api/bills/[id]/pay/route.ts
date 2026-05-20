import { NextResponse } from "next/server";
import { getBillByIdForUser, payBillById } from "@/lib/bills";
import { getCurrentUserId } from "@/lib/currentUser";
import { revalidatePath } from "next/cache";
import { notFound, serverError, badRequest } from "@/lib/responses";

export async function POST(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const userId = await getCurrentUserId();

    const bill = await getBillByIdForUser(id, userId);

    if (!bill) {
        return notFound("Bill not found or access denied.");
    }

    try {
        const result = await payBillById(id);

        revalidatePath(`/accounts/${result.bill.accountId}`);

        return NextResponse.json(result);
    } catch (error) {
        if (error instanceof Error && error.message === "BILL_ALREADY_PAID") {
            return badRequest("Bill is already paid.");
        }

        if (error instanceof Error && error.message === "BILL_NOT_FOUND") {
            return serverError("Bill not found.");
        }

        return serverError("Failed to pay bill.");
    }
}