import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getCurrentUserId } from "@/lib/currentUser";
import { getAccountById } from "@/lib/accounts";
import {
  getTransactionByIdForUser,
  updateTransactionById,
  deleteTransactionById
} from "@/lib/transactions";
import { badRequest, notFound, serverError } from "@/lib/responses";
import { validateUpdateTransactionInput } from "@/lib/validation/transactions";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const validation = validateUpdateTransactionInput(body);

    if (!validation.ok) {
      return badRequest(validation.error);
    }

    const { name, amount, type, date, accountId } = validation.data;

    const userId = await getCurrentUserId();

    const transaction = await getTransactionByIdForUser(id, userId);

    if (!transaction) {
      return notFound("Transaction not found or access denied.");
    }

    const account = await getAccountById(accountId, userId);

    if (!account) {
      return notFound("Account not found or access denied.");
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

    return serverError("Failed to update transaction.");
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string}> }
) {
  try {
    const { id } = await params;

    const userId = await getCurrentUserId();

    const transaction = await getTransactionByIdForUser(id, userId);

    if (!transaction) {
      return notFound("Transaction not found or access denied.");
    }

    const deletedTransaction = await deleteTransactionById(id);

    revalidatePath(`/accounts/${deletedTransaction.accountId}`);

    return NextResponse.json(deletedTransaction);
  } catch (error) {
    console.error("Error deleting transaction:", error);

    return serverError("Failed to delete transaction.");
  }
}