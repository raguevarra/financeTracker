import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getCurrentUserId } from "@/lib/currentUser";
import { getAccountById } from "@/lib/accounts";
import {
  getTransactionByIdForUser,
  updateTransactionById,
} from "@/lib/transactions";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { name, amount, type, date, accountId } = body;

    if (!name || amount === undefined || !type || !date || !accountId) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    const userId = await getCurrentUserId();

    const transaction = await getTransactionByIdForUser(id, userId);

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found or access denied." },
        { status: 404 }
      );
    }

    const account = await getAccountById(accountId, userId);

    if (!account) {
      return NextResponse.json(
        { error: "Account not found or access denied." },
        { status: 404 }
      );
    }

    const updatedTransaction = await updateTransactionById(id, {
      name,
      amount,
      type,
      date,
      accountId,
    });

    revalidatePath(`/accounts/${updatedTransaction.accountId}`);

    if (transaction.accountId !== updatedTransaction.accountId) {
      revalidatePath(`/accounts/${transaction.accountId}`);
    }

    return NextResponse.json(updatedTransaction);
  } catch (error) {
    console.error("Error updating transaction:", error);

    return NextResponse.json(
      { error: "Failed to update transaction." },
      { status: 500 }
    );
  }
}