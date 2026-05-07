import {
  AccountList,
  DashboardSummary,
  TransactionList,
  type DashboardSummaryData,
} from "@/components";

export default async function Home() {
  const householdId = "cmoux9agv0002miuwy6tsx1tq"

  // Fetch mock dashboard data
  const resDashboard = await fetch(
    `http://localhost:3000/api/households/${householdId}/dashboard`,
    {
      cache: "no-store",
    }
  );

  const data = await resDashboard.json();

  const dashboard = {
    balance: data.totalBalance,
    monthlySpending: 0,
    upcomingBills: 0,
  };

  return (
    <main>
      <DashboardSummary dashboard={dashboard} />
      <AccountList accounts={data.accounts} />
      <TransactionList transactions={data.recentTransactions} />
    </main>
  );
}
