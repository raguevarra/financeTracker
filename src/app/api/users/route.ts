import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Get users including their household memberships and accounts
export async function GET() {
    const users = await prisma.user.findMany({
        include: {
            householdMemberships: {
                include: {
                    household: true,
                },
            },
            accounts: true,
        },
    });

    return NextResponse.json(users);
    
}