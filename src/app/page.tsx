import {
  AccountList,
  DashboardSummary,
  TransactionList,
  TransactionForm,
} from "@/components";

export default async function Home() {
  // Fetch dashboard data from API
  const resDashboard = await fetch("http://localhost:3000/api/dashboard-broken", {
    cache: "no-store",
  });

  // Handle API errors
  if (!resDashboard.ok) {
    return <main>Failed to load dashboard.</main>
  }

  const dashboardData = await resDashboard.json();

  const dashboard = {
    balance: dashboardData.totalBalance,
    monthlySpending: dashboardData.monthlySpending,
    upcomingBills: dashboardData.upcomingBills,
  };

  return (
    <main>
      <DashboardSummary dashboard={dashboard} />
      <AccountList accounts={dashboardData.accounts} />
      <TransactionList transactions={dashboardData.recentTransactions} />
      <TransactionForm accounts={dashboardData.accounts} />
    </main>
  );
}