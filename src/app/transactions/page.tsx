import Link from "next/link";
import { AddTransactionModal, TransactionFilterList } from "@/components";
import { accountAccessWhere } from "@/lib/access";
import { getCurrentUserId } from "@/lib/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { serializeTransaction } from "@/lib/serializers";

export default async function TransactionsPage() {
  const userId = await getCurrentUserId();

  const accounts = await prisma.account.findMany({
    where: {
      isArchived: false,
      ...accountAccessWhere(userId),
    },
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
    },
  });

  const transactions = await prisma.transaction.findMany({
    where: {
      account: {
        isArchived: false,
        ...accountAccessWhere(userId),
      },
    },
    orderBy: {
      date: "desc",
    },
    include: {
      account: {
        select: {
          name: true,
        },
      },
    },
  });

  const accountOptions = accounts.map((account) => ({
    id: account.id,
    name: account.name,
  }));

  const serializedTransactions = transactions.map((transaction) => ({
    ...serializeTransaction(transaction),
    accountName: transaction.account.name,
  }));

  return (
    <div className="dashboard-page">
      <section className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">Transactions</p>
          <h1 className="dashboard-title">Transactions</h1>
          <p className="dashboard-subtitle">
            Add transactions from one place and review activity across all of
            your accounts.
          </p>
        </div>

        <div className="dashboard-header-actions">
          <Link href="/accounts" className="dashboard-secondary-link">
            View Accounts
          </Link>
        </div>
      </section>

      {accounts.length === 0 ? (
        <section className="dashboard-card">
          <p className="dashboard-card-label">No active accounts</p>
          <p className="dashboard-subtitle">
            Create an account before adding transactions.
          </p>

          <Link href="/accounts/new" className="dashboard-secondary-link">
            Add Account
          </Link>
        </section>
      ) : (
        <>
          <section className="dashboard-card">
            <p className="dashboard-card-label">Total Transactions</p>
            <p className="dashboard-balance">{serializedTransactions.length}</p>
            <p className="dashboard-subtitle">
              Showing all transactions across your active accounts.
            </p>
          </section>

          <section className="dashboard-card quick-add-card">
            <div className="dashboard-section-header quick-add-header">
              <div className="quick-add-copy">
                <p className="quick-add-title">Quick Add</p>
                <p className="quick-add-subtitle">
                  Add a transaction to any active account.
                </p>
              </div>

              <AddTransactionModal accounts={accountOptions} />
            </div>
          </section>

          <TransactionFilterList
            accounts={accountOptions}
            transactions={serializedTransactions}
          />
        </>
      )}
    </div>
  );
}