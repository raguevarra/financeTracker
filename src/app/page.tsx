import {
  DashboardSummary,
  type DashboardSummaryData,
  TransactionList,
  type Transaction,
  TransactionForm,
} from "@/components";

export default async function Home() {
  // Fetch mock dashboard data
  const resDashboard = await fetch("http://localhost:3000/api/dashboard", {
    cache: "no-store",
  });

  const dashboard: DashboardSummaryData = await resDashboard.json();

  // Fetch mock transactions data
  const resTransactions = await fetch("http://localhost:3000/api/transactions", {
    cache: "no-store",
  });

  const transactions: Transaction[] = await resTransactions.json();

  return (
    <main>
      <DashboardSummary dashboard={dashboard} />
      <TransactionList transactions={transactions} />
      <TransactionForm />
    </main>
  );
}
