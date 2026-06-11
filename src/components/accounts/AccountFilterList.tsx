"use client";

import { useMemo, useState } from "react";
import { AccountCard, type AccountCardData } from "@/components";

type AccountFilterListProps = {
  accounts: AccountCardData[];
};

type SortOption =
  | "nameAsc"
  | "nameDesc"
  | "balanceDesc"
  | "balanceAsc"
  | "typeAsc";

export function AccountFilterList({ accounts }: AccountFilterListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortOption, setSortOption] = useState<SortOption>("nameAsc");

  const accountTypes = useMemo(() => {
    return Array.from(new Set(accounts.map((account) => account.type)));
  }, [accounts]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    typeFilter !== "all" ||
    sortOption !== "nameAsc";

  function clearFilters() {
    setSearchQuery("");
    setTypeFilter("all");
    setSortOption("nameAsc");
  }

  const filteredAccounts = useMemo(() => {
    return accounts
      .filter((account) => {
        const normalizedSearch = searchQuery.trim().toLowerCase();

        const matchesSearch =
          normalizedSearch === "" ||
          account.name.toLowerCase().includes(normalizedSearch);

        const matchesType =
          typeFilter === "all" || account.type === typeFilter;

        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        if (sortOption === "nameAsc") {
          return a.name.localeCompare(b.name);
        }

        if (sortOption === "nameDesc") {
          return b.name.localeCompare(a.name);
        }

        if (sortOption === "balanceDesc") {
          return Number(b.balance) - Number(a.balance);
        }

        if (sortOption === "balanceAsc") {
          return Number(a.balance) - Number(b.balance);
        }

        if (sortOption === "typeAsc") {
          return a.type.localeCompare(b.type);
        }

        return 0;
      });
  }, [accounts, searchQuery, typeFilter, sortOption]);

  return (
    <section>
      <div className="dashboard-section-header">
        <div>
          <p className="dashboard-eyebrow">Accounts</p>
          <h2>Active Accounts</h2>
        </div>
      </div>

      <div className="transaction-filter-panel">
        <div className="transaction-filter-panel-header">
          <p className="transaction-filter-panel-title">Filters</p>
          <p className="transaction-filter-panel-subtitle">
            Narrow accounts by name, type, or balance.
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
              placeholder="Search account names"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </label>

          <label className="transaction-filter">
            <span className="transaction-filter-label">Type</span>

            <select
              className="transaction-filter-select"
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
            >
              <option value="all">All types</option>

              {accountTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label className="transaction-filter">
            <span className="transaction-filter-label">Sort by</span>

            <select
              className="transaction-filter-select"
              value={sortOption}
              onChange={(event) =>
                setSortOption(event.target.value as SortOption)
              }
            >
              <option value="nameAsc">Name A-Z</option>
              <option value="nameDesc">Name Z-A</option>
              <option value="balanceDesc">Balance high to low</option>
              <option value="balanceAsc">Balance low to high</option>
              <option value="typeAsc">Type</option>
            </select>
          </label>
        </div>
      </div>

      <p className="transaction-results-count">
        Showing {filteredAccounts.length} of {accounts.length} accounts
      </p>

      {filteredAccounts.length === 0 ? (
        <section className="transaction-empty-state">
          <p className="transaction-empty-title">No accounts found</p>
          <p className="transaction-empty-copy">
            Try adjusting your filters or clearing them to see more accounts.
          </p>
        </section>
      ) : (
        <div className="account-card-grid">
          {filteredAccounts.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
        </div>
      )}
    </section>
  );
}