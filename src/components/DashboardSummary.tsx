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
  return (
    <section>
      <h1>Dashboard</h1>

      <p>Balance: ${formatCurrency(dashboard.balance, { showSign: true })}</p>
      <p>Monthly Spending: ${formatCurrency(dashboard.monthlySpending)}</p>
      <p>Upcoming Bills: {dashboard.upcomingBills}</p>
    </section>
  );
}
