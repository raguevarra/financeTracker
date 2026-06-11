import Link from "next/link";
import { AccountFilterList } from "@/components";
import { getAccountsForUser } from "@/lib/accounts";
import { getCurrentUserId } from "@/lib/getCurrentUser";
import { serializeAccount } from "@/lib/serializers";

export default async function AccountsPage() {
  const userId = await getCurrentUserId();

  const accounts = await getAccountsForUser(userId, {
    archived: false,
  });

  const plainAccounts = accounts.map(serializeAccount);

  const totalBalance = plainAccounts.reduce((total, account) => {
    return total + Number(account.balance);
  }, 0);

  return (
    <div className="dashboard-page">
      <section className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">Accounts</p>
          <h1 className="dashboard-title">Your Accounts</h1>
          <p className="dashboard-subtitle">
            View your active accounts, balances, and account details.
          </p>
        </div>

        <div className="dashboard-header-actions">
          <Link href="/accounts/archived" className="dashboard-secondary-link">
            Archived Accounts
          </Link>
        </div>
      </section>

      <section className="dashboard-card">
        <p className="dashboard-card-label">Total Balance</p>
        <p className="dashboard-balance">
          {new Intl.NumberFormat("en-CA", {
            style: "currency",
            currency: "CAD",
          }).format(totalBalance)}
        </p>
      </section>

      <AccountFilterList accounts={plainAccounts} />
    </div>
  );
}