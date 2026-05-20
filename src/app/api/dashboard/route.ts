// Route for dashboard information
import { NextResponse } from "next/server";
import { getDashboardData } from "@/lib/dashboard";

// Error import
import { serverError } from "@/lib/responses";

// User ID Function
import { getCurrentUserId } from "@/lib/currentUser";

export async function GET() {
    try {
        const userId = await getCurrentUserId();
        const dashboardData = await getDashboardData(userId);
        return NextResponse.json(dashboardData);
    } catch (error) {
        console.error("Failed to fetch dashboard data:", error);

        return serverError("Failed to fetch dashboard data.");
    }
}