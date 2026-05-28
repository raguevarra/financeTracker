import { formatCurrency } from "@/lib/formatters";
import type { Transaction } from "../transactions/TransactionList";

type DashboardTransactionsProps = {
  transactions: Transaction[];
};

// Shows the newest transactions on the dashboard.
export function DashboardTransactionsCard({
  transactions,
}: DashboardTransactionsProps) {
  return (
    <section className="dashboard-card">
      <div className="recent-transactions-header">
        <div>
          <h2 className="dashboard-card-title">Recent Transactions</h2>
          <p className="dashboard-card-subtitle">
            Your latest account activity
          </p>
        </div>
      </div>

      {transactions.length === 0 ? (
        <p className="dashboard-placeholder-text">
          No recent transactions yet.
        </p>
      ) : (
        <div className="recent-transactions-list">
          {transactions.map((transaction) => {
            const amount = Number(transaction.amount);
            const isExpense = amount < 0;

            return (
              <article
                key={transaction.id}
                className="recent-transaction-item"
              >
                <div className="recent-transaction-main">
                  <p className="recent-transaction-name">
                    {transaction.name}
                  </p>

                  <p className="recent-transaction-meta">
                    {transaction.type}
                    {transaction.accountName
                      ? ` · ${transaction.accountName}`
                      : ""}
                  </p>
                </div>

                <div className="recent-transaction-side">
                  <p
                    className={
                      isExpense
                        ? "recent-transaction-amount expense"
                        : "recent-transaction-amount income"
                    }
                  >
                    {formatCurrency(amount, { showSign: true })}
                  </p>

                  <p className="recent-transaction-date">
                    {new Date(transaction.date).toLocaleDateString("en-CA", {
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
