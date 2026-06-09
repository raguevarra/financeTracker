import { Prisma } from "@prisma/client";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { EditTransactionButton } from "./EditTransactionButton";
import { DeleteTransactionButton } from "./DeleteTransactionButton";

export type TransactionCardData = {
  id: string;
  name: string;
  amount: Prisma.Decimal | number | string;
  type: string;
  date: Date | string;
  accountId: string;
  accountName?: string;
};

type TransactionCardProps = {
  transaction: TransactionCardData;
};

// Displays one transaction with formatted amount and date, and edit and delete actions.
export function TransactionCard({ transaction }: TransactionCardProps) {
  const amount = Number(transaction.amount);

  const amountClassName = 
    transaction.type === "TRANSFER"
      ? "transaction-card-amount-transfer"
      : amount > 0
        ? "transaction-card-amount-credit"
        : "transaction-card-amount-debit";

  return (
    <div className="transaction-card">
      <div className="transaction-card-info">
        <p className="transaction-card-name">{transaction.name}</p>
        <p className="transaction-card-date">
          {formatDate(transaction.date)}
          {transaction.accountName ? ` · ${transaction.accountName}` : ""}
        </p>
      </div>

      <div className="transaction-card-actions">
        <p className={`transaction-card-amount ${amountClassName}`}>
          {formatCurrency(transaction.amount, { showSign: true })}
        </p>

        <EditTransactionButton transaction={transaction} />
        <DeleteTransactionButton
          transactionId={transaction.id}
          transactionName={transaction.name}
        />
      </div>
    </div>
  );
}
