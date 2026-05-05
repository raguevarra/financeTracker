// Shared backend type placeholders.
// TODO: Replace or derive these from Prisma model types once the API shape settles.

export type Account = {
  id: string;
  name: string;
};

export type Transaction = {
  id: string;
  accountId: string;
  amountCents: number;
};
