/*
PATCH route to update an existing transaction
DELETE route to delete an existing transaction
*/
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
  // Try-catch block to handle potential errors during transaction update
  try {
    // Extract the transaction ID from the route params
    const { id } = await params;

    // Parse the incoming request body as JSON
    const body = await request.json();

    // JSON request validation
    const validation = validateUpdateTransactionInput(body);

    if (!validation.ok) {
      return badRequest(validation.error);
    }

    // Destructure required fields from the validated request body
    const { name, amount, type, date, accountId } = validation.data;

    const userId = await getCurrentUserId();

    // Fetch the transaction for the current user to confirm it exists and is accessible
    const transaction = await getTransactionByIdForUser(id, userId);

    // If the transaction does not exist, return a 404 error response
    if (!transaction) {
      return notFound("Transaction not found or access denied.");
    }

    const account = await getAccountById(accountId, userId);

    // If the account does not exist, return a 404 error response
    if (!account) {
      return notFound("Account not found or access denied.");
    }

    // Update the transaction in the database using Prisma
    const updatedTransaction = await updateTransactionById(id, {
      name,
      amount,
      type,
      date,
      accountId,
    });

    // Revalidate the updated account page so cached totals and transactions stay current
    revalidatePath(`/accounts/${updatedTransaction.accountId}`);

    // If the transaction moved accounts, revalidate the old account page as well
    if (transaction.accountId !== updatedTransaction.accountId) {
      revalidatePath(`/accounts/${transaction.accountId}`);
    }

    // Return the updated transaction as a JSON response
    return NextResponse.json(updatedTransaction);
  } catch (error) {
    // Log the error to the console for debugging purposes
    console.error("Error updating transaction:", error);

    // Return a generic error response with a 500 status code if something goes wrong
    return serverError("Failed to update transaction.");
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string}> }
) {
  // Try-catch block to handle potential errors during transaction deletion
  try {
    // Extract the transaction ID from the route params
    const { id } = await params;

    const userId = await getCurrentUserId();

    // Fetch the transaction for the current user to confirm it exists and is accessible
    const transaction = await getTransactionByIdForUser(id, userId);

    // If the transaction does not exist, return a 404 error response
    if (!transaction) {
      return notFound("Transaction not found or access denied.");
    }

    // Delete the transaction from the database using Prisma
    const deletedTransaction = await deleteTransactionById(id);

    // Revalidate the account page so cached totals and transactions stay current
    revalidatePath(`/accounts/${deletedTransaction.accountId}`);

    // Return the deleted transaction as a JSON response
    return NextResponse.json(deletedTransaction);
  } catch (error) {
    // Log the error to the console for debugging purposes
    console.error("Error deleting transaction:", error);

    // Return a generic error response with a 500 status code if something goes wrong
    return serverError("Failed to delete transaction.");
  }
}
