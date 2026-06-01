import { getCurrentUserId } from "@/lib/getCurrentUser";
import { getAccountById, getAccountsForUser } from "@/lib/accounts";
import { formatCurrency } from "@/lib/formatters";
import {
  AccountBillList,
  AccountDropdown,
  AccountTransactionForm,
  AddBillModal,
  TransactionCard,
  TransferForm,
} from "@/components";
import Link from "next/link";
import { serializeBill, serializeTransaction } from "@/lib/serializers";

type AccountPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AccountPage({ params }: AccountPageProps) {
  const { id } = await params;

  const userId = await getCurrentUserId();

  const account = await getAccountById(id, userId);
  const accounts = await getAccountsForUser(userId, { archived: false });

  if (!account) {
    return (
      <main>
        <Link href="/">← Back to dashboard</Link>

        <h1>Account not found</h1>
        <p>This account does not exist or you do not have access to it.</p>
      </main>
    );
  }

  const transactions = account.transactions.map(serializeTransaction);
  const bills = account.bills.map(serializeBill);

  const accountOptions = accounts.map((account) => ({
    id: account.id,
    name: account.name,
  }));


  return (
    <main>
      <Link href="/">← Back to dashboard</Link>

      <section>
        <h2>Switch account</h2>

        <AccountDropdown
          accounts={accountOptions}
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

      <TransferForm
        accounts={accountOptions}
        currentAccountId={account.id}
      />

      <section>
        <AddBillModal accountId={account.id} />
        
        <AccountBillList
          bills={bills}
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
