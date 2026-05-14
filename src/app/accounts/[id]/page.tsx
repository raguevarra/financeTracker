import { getCurrentUserId } from "@/lib/currentUser";
import { getAccountById, getAccountsForUser } from "@/lib/accounts";
import { TransactionCard } from "@/components/TransactionCard";
import { AccountTransactionForm } from "@/components/AccountTransactionForm";
import { AccountDropdown } from "@/components/AccountDropdown";
import { formatCurrency } from "@/lib/formatters";
import { AccountBillList } from "@/components";
import { AddBillModal } from "@/components/AddBillModal";
import Link from "next/link";

type AccountPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AccountPage({ params }: AccountPageProps) {
  const { id } = await params;

  const userId = await getCurrentUserId();

  const account = await getAccountById(id, userId);
  const accounts = await getAccountsForUser(userId);

  if (!account) {
    return (
      <main>
        <Link href="/">← Back to dashboard</Link>

        <h1>Account not found</h1>
        <p>This account does not exist or you do not have access to it.</p>
      </main>
    );
  }

  const transactions = account?.transactions.map((transaction) => ({
    ...transaction,
    amount: transaction.amount.toString(),
  }));


  return (
    <main>
      <Link href="/">← Back to dashboard</Link>

      <section>
        <h2>Switch account</h2>

        <AccountDropdown
          accounts={accounts}
          selectedAccountId={account.id}
        />
      </section>

      <section>
        <h1>{account.name}</h1>

        <p>Type: {account.type}</p>

        <p>
          Balance: <strong>{formatCurrency(account.balance)}</strong>
        </p>
      </section>

      <section>
        <AddBillModal accountId={account.id} />
        
        <AccountBillList
          bills={account.bills}
          accountName={account.name}
        />
      </section>

      <AccountTransactionForm accountId={account.id} />

      <section>
        <h2>Transactions</h2>

        {transactions?.length === 0 ? (
          <p>No transactions found for this account.</p>
        ) : (
          <div>
            {transactions?.map((transaction) => (
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