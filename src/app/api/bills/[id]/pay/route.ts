/*
POST route to mark an existing bill as paid
*/
import { NextResponse } from "next/server";
import { getBillByIdForUser, payBillById } from "@/lib/bills";
import { getAccountById } from "@/lib/accounts";
import { getCurrentUserId } from "@/lib/getCurrentUser";
import { revalidatePath } from "next/cache";
import { notFound, serverError, badRequest } from "@/lib/responses";
import { isNonEmptyString, isObject } from "@/lib/validation/shared";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Extract the bill ID from the route params
  const { id } = await params;

  // Parse the incoming request body as JSON
  const body = await request.json();

  // Validate request body
  if (!isObject(body)) {
    return badRequest("Invalid request body.");
  }

  const { accountId } = body;

  if (!isNonEmptyString(accountId)) {
    return badRequest("Account is required.");
  }

  const userId = await getCurrentUserId();

  // Fetch the bill for the current user to confirm it exists and is accessible
  const bill = await getBillByIdForUser(id, userId);

  if (!bill) {
    return notFound("Bill not found or access denied.");
  }

  // Fetch the account to confirm it exists and is accessible
  const account = await getAccountById(accountId, userId);

  if (!account) {
    return notFound("Account not found or access denied.");
  }

  try {
    // Pay the bill from the selected account
    const result = await payBillById(id, accountId);

    // Revalidate the account page and dashboard so balances/transactions stay current
    revalidatePath(`/accounts/${accountId}`);
    revalidatePath("/");

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error && error.message === "BILL_ALREADY_PAID") {
      return badRequest("Bill is already paid.");
    }

    if (error instanceof Error && error.message === "BILL_NOT_FOUND") {
      return notFound("Bill not found.");
    }

    console.error("Error paying bill:", error);

    return serverError("Failed to pay bill.");
  }
}