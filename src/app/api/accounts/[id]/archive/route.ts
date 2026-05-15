import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/currentUser";
import { archiveAccountForUser } from "@/lib/accounts"

type Params = {
    params: Promise<{ id: string}>;
};

export async function PATCH(request: Request, { params }: Params) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { isArchived } = body;

        if (typeof isArchived !== "boolean") {
            return NextResponse.json(
                { error: "isArchived must be a boolean." },
                { status: 400 }
            );
        }

        const userId = await getCurrentUserId();

        const account = await archiveAccountForUser({
            accountId: id,
            userId,
            isArchived,
        });

        if (!account) {
            return NextResponse.json(
                { error: "Account not found." },
                { status: 404 }
            );
        }

        return NextResponse.json(account);
    } catch (error) {
        console.error("Error updating account archive status.", error);

        return NextResponse.json(
            { error: "Failed to update account archive status." },
            { status: 500 }
        );
    }
}