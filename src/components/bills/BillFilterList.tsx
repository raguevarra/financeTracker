"use client";

import { useMemo, useState } from "react";
import { BillCard, type BillCardData } from "@/components";

type BillFilterListProps = {
  bills: BillCardData[];
};

type StatusFilter = "all" | "paid" | "unpaid";
type DueDateFilter = "all" | "overdue" | "dueSoon" | "future";
type SortOption = "dueAsc" | "dueDesc" | "amountDesc" | "amountAsc";

export function BillFilterList({ bills }: BillFilterListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [dueDateFilter, setDueDateFilter] = useState<DueDateFilter>("all");
  const [sortOption, setSortOption] = useState<SortOption>("dueAsc");

  function clearFilters() {
    setSearchQuery("");
    setStatusFilter("all");
    setDueDateFilter("all");
    setSortOption("dueAsc");
  }

  const filteredBills = useMemo(() => {
    const now = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(now.getDate() + 7);

    return bills
      .filter((bill) => {
        const normalizedSearch = searchQuery.trim().toLowerCase();
        const billDueDate = new Date(bill.dueDate);

        const matchesSearch =
          normalizedSearch === "" ||
          bill.name.toLowerCase().includes(normalizedSearch);

        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "paid" && bill.isPaid) ||
          (statusFilter === "unpaid" && !bill.isPaid);

        let matchesDueDate = true;

        if (dueDateFilter === "overdue") {
          matchesDueDate = !bill.isPaid && billDueDate < now;
        }

        if (dueDateFilter === "dueSoon") {
          matchesDueDate =
            !bill.isPaid && billDueDate >= now && billDueDate <= sevenDaysFromNow;
        }

        if (dueDateFilter === "future") {
          matchesDueDate = billDueDate > sevenDaysFromNow;
        }

        return matchesSearch && matchesStatus && matchesDueDate;
      })
      .sort((a, b) => {
        if (sortOption === "dueAsc") {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }

        if (sortOption === "dueDesc") {
          return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        }

        const amountA = Number(a.amount);
        const amountB = Number(b.amount);

        if (sortOption === "amountDesc") {
          return amountB - amountA;
        }

        if (sortOption === "amountAsc") {
          return amountA - amountB;
        }

        return 0;
      });
  }, [bills, searchQuery, statusFilter, dueDateFilter, sortOption]);

  return (
    <section>
      <div className="dashboard-section-header">
        <div>
          <p className="dashboard-eyebrow">Bills</p>
          <h2>All Bills</h2>
        </div>
      </div>

      <div className="transaction-filter-panel">
        <div className="transaction-filter-panel-header">
          <p className="transaction-filter-panel-title">Filters</p>
          <p className="transaction-filter-panel-subtitle">
            Narrow bills by name, payment status, due date, or amount.
          </p>

          <button
            className="transaction-clear-button"
            type="button"
            onClick={clearFilters}
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
              placeholder="Search bill names"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </label>

          <label className="transaction-filter">
            <span className="transaction-filter-label">Status</span>
            <select
              className="transaction-filter-select"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as StatusFilter)
              }
            >
              <option value="all">All statuses</option>
              <option value="unpaid">Unpaid</option>
              <option value="paid">Paid</option>
            </select>
          </label>

          <label className="transaction-filter">
            <span className="transaction-filter-label">Due date</span>
            <select
              className="transaction-filter-select"
              value={dueDateFilter}
              onChange={(event) =>
                setDueDateFilter(event.target.value as DueDateFilter)
              }
            >
              <option value="all">All dates</option>
              <option value="overdue">Overdue</option>
              <option value="dueSoon">Due soon</option>
              <option value="future">Future</option>
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
              <option value="dueAsc">Due soonest</option>
              <option value="dueDesc">Due latest</option>
              <option value="amountDesc">Amount high to low</option>
              <option value="amountAsc">Amount low to high</option>
            </select>
          </label>
        </div>
      </div>

      <p className="transaction-results-count">
        Showing {filteredBills.length} of {bills.length} bills
      </p>

      {filteredBills.length === 0 ? (
        <section className="transaction-empty-state">
          <p className="transaction-empty-title">No bills found</p>
          <p className="transaction-empty-copy">
            Try adjusting your filters or clearing them to see more results.
          </p>
        </section>
      ) : (
        <div className="bill-card-grid">
          {filteredBills.map((bill) => (
            <BillCard key={bill.id} bill={bill} />
          ))}
        </div>
      )}
    </section>
  );
}