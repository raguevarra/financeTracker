import { getCurrentUserId } from "@/lib/currentUser";
import { getAccountById } from "@/lib/accounts";
import { TransactionCard } from "@/components/TransactionCard";
import { AccountTransactionForm } from "@/components/AccountTransactionForm";
import { Prisma } from "@prisma/client";
import Link from "next/link";

type AccountPageProps = {
  params: {
    id: string;
  };
};

function formatCurrency(value: Prisma.Decimal | number | string) {
  const amount = Number(value);

  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(amount);
}

export default async function AccountPage({ params }: AccountPageProps) {
  const userId = await getCurrentUserId();

  const account = await getAccountById(params.id, userId);

  if (!account) {
    return (
      <main>
        <Link href="/">← Back to dashboard</Link>

        <h1>Account not found</h1>
        <p>This account does not exist or you do not have access to it.</p>
      </main>
    );
  }

  return (
    <main>
      <Link href="/">← Back to dashboard</Link>

      <section>
        <h1>{account.name}</h1>

        <p>Type: {account.type}</p>

        <p>
          Balance: <strong>{formatCurrency(account.balance)}</strong>
        </p>
      </section>

      <AccountTransactionForm accountId={account.id} />

      <section>
        <h2>Transactions</h2>

        {account.transactions.length === 0 ? (
          <p>No transactions found for this account.</p>
        ) : (
          <div>
            {account.transactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}