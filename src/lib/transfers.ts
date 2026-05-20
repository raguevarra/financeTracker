// src/lib/transfers.ts

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { adjustAccountBalance } from "./accountBalances";

type CreateTransferInput = {
  fromAccountId: string;
  toAccountId: string;
  amount: string;
  date: string;
  name?: string;
};

export async function createTransferBetweenAccounts({
  fromAccountId,
  toAccountId,
  amount,
  date,
  name,
}: CreateTransferInput) {
  const decimalAmount = new Prisma.Decimal(amount).abs();
  const transferGroupId = crypto.randomUUID();

  if (fromAccountId === toAccountId) {
    throw new Error("SAME_ACCOUNT_TRANSFER");
  }

  return prisma.$transaction(async (tx) => {
    const fromAccount = await tx.account.findUnique({
      where: { id: fromAccountId },
    });

    const toAccount = await tx.account.findUnique({
      where: { id: toAccountId },
    });

    if (!fromAccount || !toAccount) {
      throw new Error("ACCOUNT_NOT_FOUND");
    }

    const outgoingTransaction = await tx.transaction.create({
      data: {
        name: name || `Transfer to ${toAccount.name}`,
        amount: decimalAmount.negated(),
        type: "TRANSFER",
        date: new Date(date),
        accountId: fromAccountId,
        transferGroupId,
      },
    });

    const incomingTransaction = await tx.transaction.create({
      data: {
        name: name || `Transfer from ${fromAccount.name}`,
        amount: decimalAmount,
        type: "TRANSFER",
        date: new Date(date),
        accountId: toAccountId,
        transferGroupId,
      },
    });

    await adjustAccountBalance(
      tx,
      fromAccountId,
      decimalAmount.negated()
    );

    await adjustAccountBalance(
      tx,
      toAccountId,
      decimalAmount
    );

    return {
      transferGroupId,
      outgoingTransaction,
      incomingTransaction,
    };
  });
}