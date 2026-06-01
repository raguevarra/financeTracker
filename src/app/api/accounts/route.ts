/*
GET route to fetch accounts for the current user
POST route to add a new account
*/
import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/getCurrentUser";
import {
  createAccountForUser,
  getAccountsForUser,
  getDefaultHouseholdIdForUser,
} from "@/lib/accounts";
import { badRequest, serverError } from "@/lib/responses";
import { validateCreateAccountInput } from "@/lib/validation/accounts";

export async function GET(request: Request) {
  // Try-catch block to handle potential errors during account fetching
  try {
    // Read the archived query parameter from the request URL
    const { searchParams } = new URL(request.url);
    const archived = searchParams.get("archived") === "true";

    const userId = await getCurrentUserId();

    // Fetch the current user's accounts, optionally including archived accounts
    const accounts = await getAccountsForUser(userId, { archived });

    // Return the accounts as a JSON response
    return NextResponse.json(accounts);
  } catch (error) {
    // Log the error to the console for debugging purposes
    console.error("Error fetching accounts:", error);

    // Return a generic error response with a 500 status code if something goes wrong
    return serverError("Failed to fetch accounts.");
  }
}

export async function POST(request: Request) {
  // Try-catch block to handle potential errors during account creation
  try {
    // Parse the incoming request body as JSON
    const body = await request.json();

    // JSON request validation
    const validation = validateCreateAccountInput(body);

    if (!validation.ok) {
      return badRequest(validation.error);
    }

    // Destructure required fields from the validated request body
    const { name, type, balance } = validation.data;

    const userId = await getCurrentUserId();

    const householdId = await getDefaultHouseholdIdForUser(userId);

    if (!householdId) {
      return badRequest("User is not assigned to a household.");
    }

    // Create a new account in the database for the current user
    const account = await createAccountForUser({
      name,
      type,
      balance,
      ownerId: userId,
      householdId,
    });

    // Return the created account as a JSON response with a 201 status code
    return NextResponse.json(account, { status: 201 });
  } catch (error) {
    // Log the error to the console for debugging purposes
    console.error("Error creating account:", error);

    // Return a generic error response with a 500 status code if something goes wrong
    return serverError("Failed to create account.");
  }
}