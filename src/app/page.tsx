import {
  AccountList,
  DashboardSummary,
  TransactionList,
  TransactionForm,
  BillList,
  AccountForm
} from "@/components";

import Link from "next/link";
import { getCurrentUserId } from "@/lib/currentUser";
import { getDashboardData } from "@/lib/dashboard";

export default async function Home() {
  const userId = await getCurrentUserId();
  const dashboardData = await getDashboardData(userId);

  const dashboard = {
    balance: dashboardData.totalBalance,
    monthlySpending: dashboardData.monthlySpending,
    upcomingBills: dashboardData.upcomingBills?.length ?? 0,
  };
  const recentTransactions = dashboardData.recentTransactions.map((transaction) => ({
    ...transaction,
    amount: String(transaction.amount),
    date: transaction.date.toISOString(),
  }));

  return (
    <main>
      <DashboardSummary dashboard={dashboard} />
      <AccountList accounts={dashboardData.accounts} />
      <p>
        <Link href="/accounts/archived">
          View archived accounts
        </Link>
      </p>
      <AccountForm />
      <BillList bills={dashboardData.upcomingBills} />
      <TransactionList transactions={recentTransactions} />
      <TransactionForm accounts={dashboardData.accounts} />
    </main>
  );
}
