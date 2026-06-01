// src/lib/getCurrentUser.ts

import { auth, currentUser as clerkCurrentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const clerkUser = await clerkCurrentUser();

  if (!clerkUser) {
    redirect("/sign-in");
  }

  const email = clerkUser.emailAddresses[0]?.emailAddress;

  if (!email) {
    throw new Error("No email found for current Clerk user.");
  }

  const userData = {
    email,
    firstName: clerkUser.firstName,
    lastName: clerkUser.lastName,
    imageUrl: clerkUser.imageUrl,
  };

  const existingUserByClerkId = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  if (existingUserByClerkId) {
    return prisma.user.update({
      where: {
        clerkId: userId,
      },
      data: userData,
    });
  }

  const existingUserByEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUserByEmail) {
    return prisma.user.update({
      where: {
        email,
      },
      data: {
        ...userData,
        clerkId: userId,
      },
    });
  }

  return prisma.user.create({
    data: {
      ...userData,
      clerkId: userId,
    },
  });
}

export async function getCurrentUserId() {
  const user = await getCurrentUser();
  return user.id;
}