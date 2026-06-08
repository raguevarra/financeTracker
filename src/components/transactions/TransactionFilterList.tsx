"use client";

import { useMemo, useState } from "react";
import { TransactionCard, type TransactionCardData } from "@/components";

type AccountOption = {
  id: string;
  name: string;
};

type TransactionTypeFilter = "all" | "credit" | "debit" | "transfer";

type TransactionFilterListProps = {
  transactions: TransactionCardData[];
  accounts: AccountOption[];
};

export function TransactionFilterList({
  transactions,
  accounts,
}: TransactionFilterListProps) {
  const [selectedAccountId, setSelectedAccountId] = useState("all");
  const [selectedType, setSelectedType] =
    useState<TransactionTypeFilter>("all");

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchesAccount =
        selectedAccountId === "all" ||
        transaction.accountId === selectedAccountId;

      const transactionType = transaction.type.toLowerCase();

      const matchesType =
        selectedType === "all" || transactionType === selectedType;

      return matchesAccount && matchesType;
    });
  }, [transactions, selectedAccountId, selectedType]);

  return (
    <section>
      <div className="dashboard-section-header">
        <div>
          <p className="dashboard-eyebrow">Activity</p>
          <h2>All Transactions</h2>
        </div>

        <div className="transaction-filters">
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

          <label className="transaction-filter">
            <span className="transaction-filter-label">Type</span>

            <select
              className="transaction-filter-select"
              value={selectedType}
              onChange={(event) =>
                setSelectedType(event.target.value as TransactionTypeFilter)
              }
            >
              <option value="all">All types</option>
              <option value="credit">Credits</option>
              <option value="debit">Debits</option>
              <option value="transfer">Transfers</option>
            </select>
          </label>
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <section className="dashboard-card">
          <p className="dashboard-subtitle">
            No transactions found for these filters.
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