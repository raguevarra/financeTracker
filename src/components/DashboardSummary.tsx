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

      <p>Balance: ${dashboard.balance}</p>
      <p>Monthly Spending: ${dashboard.monthlySpending}</p>
      <p>Upcoming Bills: {dashboard.upcomingBills}</p>
    </section>
  );
}
