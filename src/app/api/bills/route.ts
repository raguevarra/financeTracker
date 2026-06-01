 /*
 POST route to add a new bill
 */
import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/getCurrentUser";
import { createBillForUser } from "@/lib/bills";
import { badRequest, serverError } from "@/lib/responses";
import { validateCreateBillInput } from "@/lib/validation/bills";

export async function POST(request: Request) {
  // Try-catch block to handle potential errors during bill creation
  try {
    // Parse the incoming request body as JSON
    const body = await request.json();

    // JSON request validation
    const validation = validateCreateBillInput(body);

    if (!validation.ok) {
      return badRequest(validation.error);
    }

    // Destructure required fields from the validated request body
    const { name, amount, dueDate } = validation.data;

    const userId = await getCurrentUserId();

    // Create a new bill for the current user
    const bill = await createBillForUser({
      name,
      amount,
      dueDate,
      userId,
    });

    // Return the created bill as a JSON response with a 201 status code
    return NextResponse.json(bill, { status: 201 });
  } catch (error) {
    // Log the error to the console for debugging purposes
    console.error("Error creating bill:", error);

    // Return a generic error response with a 500 status code if something goes wrong
    return serverError("Failed to create bill.");
  }
}