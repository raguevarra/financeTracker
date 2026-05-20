import { Prisma } from "@prisma/client";

type BalanceTransactionClient = Prisma.TransactionClient;

export async function adjustAccountBalance(
  tx: BalanceTransactionClient,
  accountId: string,
  amount: Prisma.Decimal
) {
  return tx.account.update({
    where: {
      id: accountId,
    },
    data: {
      balance: {
        increment: amount,
      },
    },
  });
}