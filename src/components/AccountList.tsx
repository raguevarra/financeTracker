import { Prisma } from "@prisma/client";
import Link from "next/link";
import { AccountArchiveButton } from "./AccountArchiveButton";

export type Account = {
    id: string;
    name: string;
    type: string;
    balance: Prisma.Decimal | number | string;
    isArchived: boolean;
};

type AccountListProps = {
    accounts: Account[];
};

export function AccountList({ accounts }: AccountListProps) {
    if (accounts.length === 0) {
        return <p>No accounts found.</p>;
    }

    return (
        <section>
            <h2>Accounts</h2>

            <div>
                {accounts.map((account) => (
                    <div
                        key={account.id}
                        style={{
                            display: "block",
                            padding: "12px 16px",
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            marginBottom: "8px",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: "12px",
                            }}
                        >
                            <Link
                                href={`/accounts/${account.id}`}
                                style={{
                                    textDecoration: "none",
                                    color: "inherit",
                                    flex: 1,
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
                            </Link>

                            <p style={{ margin: 0, fontWeight: "bold" }}>
                                ${Number(account.balance).toFixed(2)}
                            </p>

                            <AccountArchiveButton
                                accountId={account.id}
                                isArchived={account.isArchived}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}