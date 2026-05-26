/*
GET route to fetch dashboard information for the current user
*/
import { NextResponse } from "next/server";
import { getDashboardData } from "@/lib/dashboard";
import { serverError } from "@/lib/responses";
import { getCurrentUserId } from "@/lib/currentUser";

export async function GET() {
    // Try-catch block to handle potential errors during dashboard fetching
    try {
        const userId = await getCurrentUserId();

        // Fetch the dashboard data for the current user
        const dashboardData = await getDashboardData(userId);

        // Return the dashboard data as a JSON response
        return NextResponse.json(dashboardData);
    } catch (error) {
        // Log the error to the console for debugging purposes
        console.error("Failed to fetch dashboard data:", error);

        // Return a generic error response with a 500 status code if something goes wrong
        return serverError("Failed to fetch dashboard data.");
    }
}
