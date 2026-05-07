export type Account = {
    id: string,
    name: string,
    type: string,
    balance: number | string,
    owner?: {
        id: string,
        name: string,
        email: string,
    } | null;
};

type AccountListProps = {
    accounts: Account[];
}

function formatCurrency(value: number | string): string {
    const amount = Number(value);

    return new Intl.NumberFormat("en-CA", {
        style: "currency",
        currency: "CAD",
    }).format(amount);
}

export function AccountList({ accounts }: AccountListProps) {
    return (
        <section>
            <h2>Accounts</h2>

            {accounts.length === 0 ? (
                <p>No accounts found.</p>
            ) : (
                <div>
                    {accounts.map((account) => (
                        <article key={account.id}>
                            <h3>{account.name}</h3>

                            <p>Type: {account.type}</p>
                            <p>Balance: {formatCurrency(account.balance)}</p>

                            {account.owner && <p>Owner: {account.owner.name}</p>}
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}