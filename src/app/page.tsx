import {
  DashboardHeader,
  DashboardSummary,
  DashboardTransactionsCard,
} from "@/components";

import {
  serializeTransaction,
} from "@/lib/serializers";

import { getCurrentUserId } from "@/lib/getCurrentUser";
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
    <div className="dashboard-page">
      <DashboardHeader />

      <DashboardSummary dashboard={dashboard} />

      <section className="dashboard-grid">
        <DashboardTransactionsCard transactions={recentTransactions} />

        <section className="dashboard-card">
          <h2 className="dashboard-card-title">
            Spending by Member
          </h2>

          <p className="dashboard-placeholder-text">
            Member spending will go here once transactions are connected to users.
          </p>
        </section>
      </section>
    </div>
  );
}