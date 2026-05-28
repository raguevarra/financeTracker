export type Transaction = {
  id: string;
  name: string;
  amount: number | string;
  type: string;
  date: string;
  accountName?: string;
};

type TransactionListProps = {
  transactions: Transaction[];
};

function formatCurrency(value: number | string) {
  const amount = Number(value);

  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(amount);
}

export function TransactionList({ transactions }: TransactionListProps) {
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <section>
      <h2>Transactions</h2>

      {sortedTransactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <div>
          {sortedTransactions.map((transaction) => {
            const amount = Number(transaction.amount);

            return (
              <div
                key={transaction.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "10px",
                  borderBottom: "1px solid #ccc",
                }}
              >
                <div>
                  <strong>{transaction.name}</strong>
                  <p>{transaction.type}</p>

                  {transaction.accountName && (
                    <p>Account: {transaction.accountName}</p>
                  )}
                </div>

                <span>{formatCurrency(amount)}</span>

                <span>{new Date(transaction.date).toLocaleDateString()}</span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}