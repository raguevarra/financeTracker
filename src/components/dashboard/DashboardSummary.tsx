import { formatCurrency } from "@/lib/formatters";

export type DashboardSummaryData = {
  balance: number;
  monthlySpending: number;
  upcomingBills: number;
};

type DashboardSummaryProps = {
  dashboard: DashboardSummaryData;
};

export function DashboardSummary({ dashboard }: DashboardSummaryProps) {
  const summaryCards = [
    {
      label: "Total Balance",
      value: formatCurrency(dashboard.balance, { showSign: true }),
      helperText: "Across all active accounts"
    },
    {
      label: "Monthly Spending",
      value: formatCurrency(dashboard.monthlySpending),
      helperText: "Spent so far this month",
    },
    {
      label: "Upcoming Bills",
      value: dashboard.upcomingBills.toString(),
      helperText: "Due in the next few days",
    },
  ];

  return (
    <section className="summary-grid" aria-label="Dashboard summary">
      {summaryCards.map((card) => (
        <article key={card.label} className="summary-card">
          <p className="summary-card-label">{card.label}</p>
          <p className="summary-card-value">{card.value}</p>
          <p className="summary-card-helper">{card.helperText}</p>
        </article>
      ))}
    </section>
  );
}
