import Link from "next/link";
import { formatCurrency } from "@/lib/formatters";
import { AccountArchiveButton } from "./AccountArchiveButton";

export type AccountCardData = {
  id: string;
  name: string;
  type: string;
  balance: string;
  isArchived: boolean;
};

type AccountCardProps = {
  account: AccountCardData;
};

function formatAccountType(type: string) {
  return type
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function AccountCard({ account }: AccountCardProps) {
  return (
    <article className="account-card">
      <Link href={`/accounts/${account.id}`} className="account-card-main">
        <div>
          <h3>{account.name}</h3>
          <p>{formatAccountType(account.type)}</p>
        </div>

        <p className="account-card-balance">
          {formatCurrency(account.balance)}
        </p>
      </Link>

      <div className="account-card-actions">
        <AccountArchiveButton
          accountId={account.id}
          isArchived={account.isArchived}
        />
      </div>
    </article>
  );
}