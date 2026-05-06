export type Transaction = {
  id: number;
  name: string;
  amount: number;
  date: string;
};

type TransactionListProps = {
  transactions: Transaction[];
};

export function TransactionList({ transactions }: TransactionListProps) {
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <section>
      <h1>Transactions</h1>

      <div>
        {sortedTransactions.map((transaction) => (
          <div
            key={transaction.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px",
              borderBottom: "1px solid #ccc",
            }}
          >
            <span>{transaction.name}</span>

            <span style={{ color: transaction.amount < 0 ? "red" : "green" }}>
              ${transaction.amount}
            </span>

            <span>{new Date(transaction.date).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
