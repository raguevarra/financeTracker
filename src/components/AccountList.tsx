import Link from "next/link";

export type Account = {
    id: string;
    name: string;
    type: string;
    balance: number | string;
};

type AccountListProps = {
    accounts: Account[];
};

export function AccountList({ accounts }: AccountListProps) {
    // If no accounts have been added
    if (accounts.length === 0) {
        return <p>No accounts found.</p>;
    }

    return (
        <section>
            <h2>Accounts</h2>

            <div>
                {accounts.map((account) => (
                    <Link
                        key={account.id}
                        href={`/accounts/${account.id}`}
                        style={{
                            display: "block",
                            padding: "12px 16px",
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            marginBottom: "8px",
                            textDecoration: "none",
                            color: "inherit",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <div>
                                <p style={{ margin: 0, fontWeight: "bold" }}>
                                    {account.name}
                                </p>
                                <p style={{ margin: 0, fontSize: "0.9rem", color: "#666" }}>
                                    {account.type}
                                </p>
                            </div>

                            <p style={{ margin: 0, fontWeight: "bold" }}>
                                ${Number(account.balance).toFixed(2)}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}