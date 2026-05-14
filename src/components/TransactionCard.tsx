import { Prisma } from "@prisma/client";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { EditTransactionButton } from "./EditTransactionButton";

export type TransactionCardData = {
  id: string;
  name: string;
  amount: Prisma.Decimal | number | string;
  type: string;
  date: Date | string;
  accountId: string;
};

type TransactionCardProps = {
  transaction: TransactionCardData;
};

export function TransactionCard({ transaction }: TransactionCardProps) {
  const amount = Number(transaction.amount);
  const isExpense = amount < 0;

  return (
    <div className="transaction-card">
      <div className="transaction-card-info">
        <p className="transaction-card-name">{transaction.name}</p>
        <p className="transaction-card-date">{formatDate(transaction.date)}</p>
      </div>

      <div className="transaction-card-actions">
        <p className="transaction-card-amount">
          {formatCurrency(transaction.amount, { showSign: true })}
        </p>

        <EditTransactionButton transaction={transaction} />
      </div>
    </div>
  );
}