import { prisma } from "./prisma";
import { Prisma, AccountType } from "@prisma/client";
import { accountAccessWhere } from "./access";

type CreateAccountInput = {
  name: string;
  type: AccountType;
  balance: string;
  ownerId: string;
  householdId: string;
};

export async function getAccountById(accountId: string, userId: string) {
  const account = await prisma.account.findFirst({
    where: {
      id: accountId,
      ...accountAccessWhere(userId),
    },
    include: {
      transactions: {
        orderBy: {
          date: "desc",
        },
      },
    },
  });

  return account;
}

export async function getAccountsForUser(
  userId: string,
  options?: { archived?: boolean }
) {
  const archived = options?.archived ?? false;

  const accounts = await prisma.account.findMany({
    where: {
      isArchived: archived,
      ...accountAccessWhere(userId),
    },
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      type: true,
      balance: true,
      isArchived: true,
    },
  });

  return accounts;
}

export async function getDefaultHouseholdIdForUser(userId: string) {
  const membership = await prisma.householdMember.findFirst({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "asc",
    },
    select: {
      householdId: true,
    },
  });

  return membership?.householdId ?? null;
}

export async function createAccountForUser({
  name,
  type,
  balance,
  ownerId,
  householdId,
}: CreateAccountInput) {
  return prisma.account.create({
    data: {
      name,
      type,
      balance: new Prisma.Decimal(balance),
      ownerId,
      householdId,
    },
  });
}

export async function archiveAccountForUser({
  accountId,
  userId,
  isArchived,
}: {
  accountId: string;
  userId: string;
  isArchived: boolean;
}) {
  const account = await prisma.account.findFirst({
    where: {
      id: accountId,
      ...accountAccessWhere(userId),
    },
  });

  if (!account) {
    return null;
  }

  return prisma.account.update({
    where: {
      id: accountId,
    },
    data: {
      isArchived,
    },
  });
}