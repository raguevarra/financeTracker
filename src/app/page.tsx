import {
  DashboardSummary,
  type DashboardSummaryData,
  TransactionList,
  type Transaction,
  TransactionForm,
} from "@/components";

export default async function Home() {
  const householdId = "cmoux9agv0002miuwy6tsx1tq"

  // Fetch mock dashboard data
  const resDashboard = await fetch(
    'http://localhost:3000/api/households/${householdId}/dashboard',
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
    </main>
  );
}
