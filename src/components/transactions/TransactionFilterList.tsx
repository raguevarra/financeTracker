"use client";

import { useMemo, useState } from "react";
import { TransactionCard, type TransactionCardData } from "@/components";

type AccountOption = {
  id: string;
  name: string;
};

type TransactionTypeFilter = "all" | "credit" | "debit" | "transfer";
type DateRangeFilter = "all" | "1" | "3" | "7" | "14" | "30" | "custom";
type AmountOperator = "none" | "greaterThan" | "lessThan" | "equalTo";

type TransactionFilterListProps = {
  transactions: TransactionCardData[];
  accounts: AccountOption[];
};

type SortOption =
  | "dateDesc"
  | "dateAsc"
  | "amountDesc"
  | "amountAsc";

export function TransactionFilterList({
  transactions,
  accounts,
}: TransactionFilterListProps) {
  const [selectedAccountId, setSelectedAccountId] = useState("all");
  const [selectedType, setSelectedType] =
    useState<TransactionTypeFilter>("all");

  const [selectedDateRange, setSelectedDateRange] =
    useState<DateRangeFilter>("all");
  const [customDays, setCustomDays] = useState("");

  const [amountOperator, setAmountOperator] =
    useState<AmountOperator>("none");
  const [amountValue, setAmountValue] = useState("");

  const [sortOption, setSortOption] = useState<SortOption>("dateDesc");

  const [searchQuery, setSearchQuery] = useState("");

  function clearFilters() {
    setSearchQuery("");
    setSelectedAccountId("all");
    setSelectedType("all");
    setSelectedDateRange("all");
    setCustomDays("");
    setAmountOperator("none");
    setAmountValue("");
    setSortOption("dateDesc");
  }

  const hasActiveFilters =
  searchQuery.trim() !== "" ||
  selectedAccountId !== "all" ||
  selectedType !== "all" ||
  selectedDateRange !== "all" ||
  customDays.trim() !== "" ||
  amountOperator !== "none" ||
  amountValue.trim() !== "" ||
  sortOption !== "dateDesc";

  const filteredTransactions = useMemo(() => {
    const amountNumber = Number(amountValue);
    const hasValidAmountFilter =
      amountOperator !== "none" &&
      amountValue.trim() !== "" &&
      !Number.isNaN(amountNumber);

    const days =
      selectedDateRange === "custom"
        ? Number(customDays)
        : Number(selectedDateRange);

    const hasValidDateFilter =
      selectedDateRange !== "all" && !Number.isNaN(days) && days > 0;

    const dateCutoff = hasValidDateFilter
      ? new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      : null;

    return transactions
    .filter((transaction) => {
      const matchesAccount =
        selectedAccountId === "all" ||
        transaction.accountId === selectedAccountId;

      const transactionType = transaction.type.toLowerCase();

      const matchesType =
        selectedType === "all" || transactionType === selectedType;

      const transactionDate = new Date(transaction.date);

      const matchesDate = !dateCutoff || transactionDate >= dateCutoff;

      const transactionAmount = Math.abs(Number(transaction.amount));

      let matchesAmount = true;

      if (hasValidAmountFilter) {
        if (amountOperator === "greaterThan") {
          matchesAmount = transactionAmount > amountNumber;
        }

        if (amountOperator === "lessThan") {
          matchesAmount = transactionAmount < amountNumber;
        }

        if (amountOperator === "equalTo") {
          matchesAmount = transactionAmount === amountNumber;
        }
      }

      const normalizedSearchQuery = searchQuery.trim().toLowerCase();

      const matchesSearch = 
        normalizedSearchQuery === "" ||
        transaction.name.toLowerCase().includes(normalizedSearchQuery);

      return(
        matchesAccount &&
        matchesType &&
        matchesDate &&
        matchesAmount &&
        matchesSearch
      );
    })
    .sort((a, b) => {
      if (sortOption === "dateDesc") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }

      if (sortOption === "dateAsc") {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }

      const amountA = Math.abs(Number(a.amount));
      const amountB = Math.abs(Number(b.amount));

      if (sortOption === "amountDesc") {
        return amountB - amountA;
      }

      if (sortOption === "amountAsc") {
        return amountA - amountB;
      }

      return 0;
    });
  }, [
    transactions,
    selectedAccountId,
    selectedType,
    selectedDateRange,
    customDays,
    amountOperator,
    amountValue,
    sortOption,
    searchQuery
  ]);

  return (
    <section>
      <div className="dashboard-section-header">
        <div>
          <p className="dashboard-eyebrow">Activity</p>
          <h2>All Transactions</h2>
        </div>
      </div>

      <div className="transaction-filter-panel">
        <div className="transaction-filter-panel-header">
          <p className="transaction-filter-panel-title">Filters</p>
          <p className="transaction-filter-panel-subtitle">
            Narrow transactions by account, type, date, amount, or name.
          </p>

          <button
            className="transaction-clear-button"
            type="button"
            onClick={clearFilters}
            disabled={!hasActiveFilters}
          >
            Clear filters
          </button>
        </div>
        <div className="transaction-filters">
          <label className="transaction-filter transaction-search-filter">
            <span className="transaction-filter-label">Search</span>

            <input
              className="transaction-filter-input"
              type="search"
              placeholder="Search transaction names"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </label>

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

          <label className="transaction-filter">
            <span className="transaction-filter-label">Date range</span>

            <select
              className="transaction-filter-select"
              value={selectedDateRange}
              onChange={(event) =>
                setSelectedDateRange(event.target.value as DateRangeFilter)
              }
            >
              <option value="all">All time</option>
              <option value="1">Past 1 day</option>
              <option value="3">Past 3 days</option>
              <option value="7">Past 7 days</option>
              <option value="14">Past 14 days</option>
              <option value="30">Past 1 month</option>
              <option value="custom">Custom days</option>
            </select>
          </label>

          {selectedDateRange === "custom" && (
            <label className="transaction-filter transaction-filter-small">
              <span className="transaction-filter-label">Days</span>

              <input
                className="transaction-filter-input"
                type="number"
                min="1"
                placeholder="Ex. 10"
                value={customDays}
                onChange={(event) => setCustomDays(event.target.value)}
              />
            </label>
          )}

          <label className="transaction-filter">
            <span className="transaction-filter-label">Amount</span>

            <select
              className="transaction-filter-select"
              value={amountOperator}
              onChange={(event) =>
                setAmountOperator(event.target.value as AmountOperator)
              }
            >
              <option value="none">Any amount</option>
              <option value="greaterThan">Greater than</option>
              <option value="lessThan">Less than</option>
              <option value="equalTo">Equal to</option>
            </select>
          </label>

          {amountOperator !== "none" && (
            <label className="transaction-filter transaction-filter-small">
              <span className="transaction-filter-label">Amount value</span>

              <input
                className="transaction-filter-input"
                type="number"
                min="0"
                step="0.01"
                placeholder="Ex. 50"
                value={amountValue}
                onChange={(event) => setAmountValue(event.target.value)}
              />
            </label>
          )}

          <label className="transaction-filter">
            <span className="transaction-filter-label">Sort by</span>

            <select
              className="transaction-filter-select"
              value={sortOption}
              onChange={(event) =>
                setSortOption(event.target.value as SortOption)
              }
            >
              <option value="dateDesc">Newest first</option>
              <option value="dateAsc">Oldest first</option>
              <option value="amountDesc">Amount high to low</option>
              <option value="amountAsc">Amount low to high</option>
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