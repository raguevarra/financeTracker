// Route for dashboard information
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getDashboardData } from "@/lib/dashboard";

// User ID Function
import { getCurrentUserId } from "@/lib/currentUser";

export async function GET() {
    const userId = await getCurrentUserId();

    const dashboardData = await getDashboardData(userId);

    return NextResponse.json(dashboardData);
}