import Link from "next/link";
import { AccountFilterList } from "@/components";
import { getAccountsForUser } from "@/lib/accounts";
import { getCurrentUserId } from "@/lib/getCurrentUser";
import { serializeAccount } from "@/lib/serializers";
import { formatCurrency } from "@/lib/formatters";

export default async function AccountsPage() {
  const userId = await getCurrentUserId();

  const accounts = await getAccountsForUser(userId, {
    archived: false,
  });

  const plainAccounts = accounts.map(serializeAccount);

  const totalBalance = plainAccounts.reduce((total, account) => {
    return total + Number(account.balance);
  }, 0);

  const cashAndChequingBalance = plainAccounts
    .filter((account) => account.type === "CASH" || account.type === "CHEQUING")
    .reduce((total, account) => {
      return total + Number(account.balance);
    }, 0);

  const savingsAndInvestmentsBalance = plainAccounts
    .filter(
      (account) =>
        account.type === "SAVINGS" || account.type === "INVESTMENT"
    )
    .reduce((total, account) => {
      return total + Number(account.balance);
    }, 0);

  const creditCardBalance = plainAccounts
    .filter((account) => account.type === "CREDIT_CARD")
    .reduce((total, account) => {
      return total + Number(account.balance);
    }, 0);

  const activeAccountCount = plainAccounts.length;

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

      <section className="accounts-summary-card">
        <div className="accounts-summary-item accounts-summary-primary">
          <p className="dashboard-card-label">Total Balance</p>
          <p className="dashboard-balance">{formatCurrency(totalBalance)}</p>
        </div>

        <div className="accounts-summary-item">
          <p className="dashboard-card-label">Cash & Chequing</p>
          <p className="accounts-summary-value">
            {formatCurrency(cashAndChequingBalance)}
          </p>
        </div>

        <div className="accounts-summary-item">
          <p className="dashboard-card-label">Savings & Investments</p>
          <p className="accounts-summary-value">
            {formatCurrency(savingsAndInvestmentsBalance)}
          </p>
        </div>

        <div className="accounts-summary-item">
          <p className="dashboard-card-label">Credit Cards</p>
          <p className="accounts-summary-value">
            {formatCurrency(creditCardBalance)}
          </p>
        </div>

        <div className="accounts-summary-item">
          <p className="dashboard-card-label">Active Accounts</p>
          <p className="accounts-summary-value">{activeAccountCount}</p>
        </div>
      </section>

      <AccountFilterList accounts={plainAccounts} />
    </div>
  );
}