import { Prisma } from "@prisma/client";
import { formatCurrency, formatDate } from "@/lib/formatters";

export type TransactionCardData = {
  id: string;
  name: string;
  amount: Prisma.Decimal | number | string;
  date: Date | string;
};

type TransactionCardProps = {
  transaction: TransactionCardData;
};

export function TransactionCard({ transaction }: TransactionCardProps) {
  const amount = Number(transaction.amount);
  const isExpense = amount < 0;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 16px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        marginBottom: "8px",
      }}
    >
      <div>
        <p
          style={{
            margin: 0,
            fontWeight: "bold",
          }}
        >
          {transaction.name}
        </p>

        <p
          style={{
            margin: 0,
            fontSize: "0.9rem",
            color: "#666",
          }}
        >
          {formatDate(transaction.date)}
        </p>
      </div>

      <p
        style={{
          margin: 0,
          fontWeight: "bold",
        }}
      >
        {formatCurrency(transaction.amount, { showSign: true })}
      </p>
    </div>
  );
}