/*
GET route to fetch users with household memberships and accounts
*/
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    // Fetch users including their household memberships and accounts
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

    // Return the users as a JSON response
    return NextResponse.json(users);
    
}
