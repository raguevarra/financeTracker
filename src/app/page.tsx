import {
  DashboardSummary,
  TransactionList,
} from "@/components";

import {
  serializeTransaction,
} from "@/lib/serializers";

import { getCurrentUserId } from "@/lib/currentUser";
import { getDashboardData } from "@/lib/dashboard";

export default async function Home() {
  const userId = await getCurrentUserId();
  const dashboardData = await getDashboardData(userId);

  const recentTransactions = dashboardData.recentTransactions.map(
    serializeTransaction
  );

  const dashboard = {
    balance: dashboardData.totalBalance,
    monthlySpending: dashboardData.monthlySpending,
    upcomingBills: dashboardData.upcomingBills?.length ?? 0,
  };

  return (
    <main className="dashboard-page">
      <section className="dashboard-header">
        <p className="dashboard-eyebrow">Household Dashboard</p>

        <h1 className="dashboard-title">
          Welcome back
        </h1>

        <p className="dashboard-subtitle">
          Here&apos;s a quick look at your household finances.
        </p>
      </section>

      <DashboardSummary dashboard={dashboard} />

      <section className="dashboard-grid">
        <section className="dashboard-card">
          <TransactionList transactions={recentTransactions} />
        </section>

        <section className="dashboard-card">
          <h2 className="dashboard-card-title">
            Spending by Member
          </h2>

          <p className="dashboard-placeholder-text">
            Member spending will go here once transactions are connected to users.
          </p>
        </section>
      </section>
    </main>
  );
}