import Link from "next/link";
import { getCurrentUserId } from "@/lib/currentUser";
import { getAccountsForUser } from "@/lib/accounts";
import { AccountList } from "@/components/AccountList";

export default async function ArchivedAccountsPage() {
    const userId = await getCurrentUserId();

    const archivedAccounts = await getAccountsForUser(userId, {
        archived: true,
    });

    const plainArchivedAccounts = archivedAccounts.map((account) => ({
        ...account,
        balance: account.balance.toString(),
    }));

    return (
        <main>
            <Link href="/">Back to dashboard.</Link>

            <section>
                <h1>Archived Accounts</h1>
                <p>
                    These accounts are hidden from the main accounts page, but you can restore them here.
                </p>
            </section>

            <AccountList 
                accounts={plainArchivedAccounts}
                title="Archived Accounts"
            />
        </main>
    )
}