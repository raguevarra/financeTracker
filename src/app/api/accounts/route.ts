import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/currentUser";
import { createAccountForUser, getAccountsForUser } from "@/lib/accounts";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const archived = searchParams.get("archived") === "true";

        const userId = await getCurrentUserId();
        const accounts = await getAccountsForUser(userId, { archived });

        return NextResponse.json(accounts);
    } catch (error) {
        console.error("Error fetching accounts:", error);

        return NextResponse.json(
            { error: "Failed to fetch accounts." },
            { status: 500 }
        );
    }
}
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, type, balance } = body;

        if (!name || !type || balance === undefined) {
            return NextResponse.json(
                { error: "Missing required fields." },
                { status: 400 }
            );
        }

        const userId = await getCurrentUserId();

        const account = await createAccountForUser({
            name,
            type,
            balance,
            ownerId: userId,
        });

        return NextResponse.json(account, { status: 201 });
    } catch (error) {
        console.error("Error creating account:", error);

        return NextResponse.json(
            { error: "Failed to create account." },
            { status: 500 }
        );
    }
}