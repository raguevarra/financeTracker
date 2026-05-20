import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getCurrentUserId } from "@/lib/currentUser";
import { getAccountById } from "@/lib/accounts";
import { createTransferBetweenAccounts } from "@/lib/transfers";
import { badRequest, notFound, serverError } from "@/lib/responses";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { fromAccountId, toAccountId, amount, date, name } = body;

        if (!fromAccountId || !toAccountId || amount === undefined || !date) {
            return NextResponse.json(
                { error: "Missing required fields." },
                { status: 400 }
            );
        }

        if (fromAccountId === toAccountId) {
            return NextResponse.json(
                { error: "Cannot transfer to the same account." },
                { status: 400 }
            );
        }

        const userId = await getCurrentUserId();

        const fromAccount = await getAccountById(fromAccountId, userId);
        const toAccount = await getAccountById(toAccountId, userId);

        if (!fromAccount || !toAccount) {
            return NextResponse.json(
                { error: "Account not found or access denied." },
                { status: 404}
            );
        }

        const transfer = await createTransferBetweenAccounts({
            fromAccountId,
            toAccountId,
            amount,
            date,
            name
        });

        revalidatePath("/");
        revalidatePath(`/accounts/${fromAccountId}`);
        revalidatePath(`/accounts/${toAccountId}`);

        return NextResponse.json(transfer, { status: 201 });
    } catch (error) {
        console.error("Error creating transfer:", error);

        if (error instanceof Error) {
            if (error.message === "SAME_ACCOUNT_TRANSFER") {
                return badRequest("Cannot transfer to the same account.");
            }

            if (error.message === "ACCOUNT_NOT_FOUND") {
                return notFound("Account not found or access denied.");
            }
        }

        return serverError("Failed to create transfer.");
    }
}