import Link from "next/link";
import { TransactionCard, TransactionForm } from "@/components";
import { accountAccessWhere } from "@/lib/access";
import { formatCurrency } from "@/lib/formatters";
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
      type: true,
      balance: true,
      transactions: {
        orderBy: {
          date: "desc",
        },
        take: 2,
      },
    },
  });

  const accountOptions = accounts.map((account) => ({
    id: account.id,
    name: account.name,
  }));

  const totalRecentTransactions = accounts.reduce((total, account) => {
    return total + account.transactions.length;
  }, 0);

  return (
    <div className="dashboard-page">
      <section className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">Transactions</p>
          <h1 className="dashboard-title">Transactions Landing</h1>
          <p className="dashboard-subtitle">
            Add transactions from one place and review recent activity across
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
            <p className="dashboard-card-label">Recent Transactions Shown</p>
            <p className="dashboard-balance">{totalRecentTransactions}</p>
            <p className="dashboard-subtitle">
              Showing up to 2 recent transactions per active account.
            </p>
          </section>

          <section className="dashboard-card">
            <TransactionForm accounts={accountOptions} />
          </section>

          <section>
            <div className="dashboard-section-header">
              <div>
                <p className="dashboard-eyebrow">Recent Activity</p>
                <h2>Recent Transactions by Account</h2>
              </div>
            </div>

            <div className="dashboard-card-list">
              {accounts.map((account) => {
                const transactions =
                  account.transactions.map(serializeTransaction);

                return (
                  <section key={account.id} className="dashboard-card">
                    <div className="dashboard-section-header">
                      <div>
                        <h3>{account.name}</h3>
                        <p className="dashboard-subtitle">
                          {account.type.replaceAll("_", " ")} ·{" "}
                          {formatCurrency(account.balance)}
                        </p>
                      </div>

                      <Link
                        href={`/accounts/${account.id}`}
                        className="dashboard-secondary-link"
                      >
                        View Account
                      </Link>
                    </div>

                    {transactions.length === 0 ? (
                      <p className="dashboard-subtitle">
                        No transactions found for this account yet.
                      </p>
                    ) : (
                      <div className="transaction-list">
                        {transactions.map((transaction) => (
                          <TransactionCard
                            key={transaction.id}
                            transaction={transaction}
                          />
                        ))}
                      </div>
                    )}
                  </section>
                );
              })}
            </div>
          </section>
        </>
      )}
    </div>
  );
}