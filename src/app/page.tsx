import {
  AccountList,
  DashboardSummary,
  TransactionList,
  TransactionForm,
  BillList,
  AccountForm
} from "@/components";

import {
  serializeAccount,
  serializeBill,
  serializeTransaction,
} from "@/lib/serializers"

import Link from "next/link";
import { getCurrentUserId } from "@/lib/currentUser";
import { getDashboardData } from "@/lib/dashboard";

export default async function Home() {
  const userId = await getCurrentUserId();
  const dashboardData = await getDashboardData(userId);
  const accounts = dashboardData.accounts.map(serializeAccount);
  const upcomingBills = dashboardData.upcomingBills.map(serializeBill);
  const recentTransactions = dashboardData.recentTransactions.map(serializeTransaction);

  const accountOptions = accounts.map((account) => ({
    id: account.id,
    name: account.name,
  }));

  const dashboard = {
    balance: dashboardData.totalBalance,
    monthlySpending: dashboardData.monthlySpending,
    upcomingBills: dashboardData.upcomingBills?.length ?? 0,
  };

  return (
    <main>
      <AccountList accounts={accounts} />

      <p>
        <Link href="/accounts/archived">
          View archived accounts
        </Link>
      </p>

      <AccountForm />

      <BillList bills={upcomingBills} />
      <TransactionList transactions={recentTransactions} />
      <TransactionForm accounts={accountOptions} />
    </main>
  );
}
