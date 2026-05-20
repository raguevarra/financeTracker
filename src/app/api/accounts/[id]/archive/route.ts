import { NextResponse } from "next/server";
import { getCurrentUserId } from "@/lib/currentUser";
import { archiveAccountForUser } from "@/lib/accounts"
import { badRequest, notFound, serverError } from "@/lib/responses";

type Params = {
    params: Promise<{ id: string}>;
};

export async function PATCH(request: Request, { params }: Params) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { isArchived } = body;

        if (typeof isArchived !== "boolean") {
            return badRequest("isArchived must be a boolean.");
        }

        const userId = await getCurrentUserId();

        const account = await archiveAccountForUser({
            accountId: id,
            userId,
            isArchived,
        });

        if (!account) {
            return notFound("Account not found.");
        }

        return NextResponse.json(account);
    } catch (error) {
        console.error("Error updating account archive status.", error);

        return serverError("Failed to update account archive status.");
    }
}