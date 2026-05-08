import { getCurrentUserId } from "@/lib/currentUser";
import { getAccountById } from "@/lib/accounts";
import { TransactionCard } from "@/components/TransactionCard";
import Link from "next/link";

type AccountPageProps = {
    params: {
        id: string;
    };
};

export default async function AccountPage({ params }: AccountPageProps) {
    const userId = await getCurrentUserId();

    const account = await getAccountById(params.id, userId);

    if (!account) {
        return (
            <main>
                <p>Account not found.</p>
                <Link href="/">Back to dashboard</Link>
            </main>
        );
    }

    return (
        <main>
            <Link href="/">Back to dashboard</Link>

            <h1>{account.name}</h1>

            <p>Balance: ${Number(account.balance).toFixed(2)}</p>

            <h2>Transactions</h2>

            {account.transactions.length === 0 ? (
                <p>No transactions found.</p>
            ) : (
                <div>
                    {account.transactions.map((transaction) => (
                        <TransactionCard
                            key={transaction.id}
                            transaction={transaction}
                        />
                    ))}
                </div>
            )}
        </main>
    );
}