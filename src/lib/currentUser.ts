import { currentUser as getClerkUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getCurrentUserId() {
    const clerkUser = await getClerkUser();

    if (!clerkUser) {
        throw new Error("No authenticated Clerk user found.");
    }

    const email =
        clerkUser.primaryEmailAddress?.emailAddress ??
        clerkUser.emailAddresses[0]?.emailAddress;

    if (!email) {
        throw new Error("Authenticated Clerk user does not have an email address.");
    }

    const name =
        clerkUser.fullName ??
        clerkUser.username ??
        email.split("@")[0];

    const existingUser = await prisma.user.findUnique({
        where: {
            clerkId: clerkUser.id,
        },
        select: {
            id: true,
        },
    });

    if (existingUser) {
        return existingUser.id;
    }

    const userWithEmail = await prisma.user.findUnique({
        where: {
            email,
        },
        select: {
            id: true,
        },
    });

    if (userWithEmail) {
        const user = await prisma.user.update({
            where: {
                id: userWithEmail.id,
            },
            data: {
                clerkId: clerkUser.id,
                name,
            },
            select: {
                id: true,
            },
        });

        return user.id;
    }

    const user = await prisma.user.create({
        data: {
            clerkId: clerkUser.id,
            name,
            email,
        },
        select: {
            id: true,
        },
    });

    return user.id;
}
