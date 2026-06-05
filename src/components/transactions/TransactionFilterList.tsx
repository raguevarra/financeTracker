"use client";

import { useMemo, useState } from "react";
import { TransactionCard, type TransactionCardData } from "@/components"

type AccountOption = {
    id: string;
    name: string;
};

type TransactionFilterListProps = {
    transactions: TransactionCardData[];
    accounts: AccountOption[];
};

export function TransactionFilterList({
    transactions,
    accounts,
}: TransactionFilterListProps) {
    const [selectedAccountId, setSelectedAccountId] = useState("all");

    const filteredTransactions = useMemo(() => {
        if (selectedAccountId === "all") {
            return transactions;
        }

        return transactions.filter((transaction) => {
            return transaction.accountId === selectedAccountId;
        });
    }, [transactions, selectedAccountId]);

    return (
    <section>
      <div className="dashboard-section-header">
        <div>
          <p className="dashboard-eyebrow">Activity</p>
          <h2>All Transactions</h2>
        </div>

        <label className="transaction-filter">
          <span className="transaction-filter-label">Account</span>

          <select
            className="transaction-filter-select"
            value={selectedAccountId}
            onChange={(event) => setSelectedAccountId(event.target.value)}
          >
            <option value="all">All accounts</option>

            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {filteredTransactions.length === 0 ? (
        <section className="dashboard-card">
          <p className="dashboard-subtitle">
            No transactions found for this account yet.
          </p>
        </section>
      ) : (
        <div className="transaction-list">
          {filteredTransactions.map((transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          ))}
        </div>
      )}
    </section>
  );
}