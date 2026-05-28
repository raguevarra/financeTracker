"use client";

import { useState } from "react";
import { AccountList, type Account } from "./AccountList";

type AccountSelectorProps = {
    accounts: Account[];
}

export function AccountSelector({ accounts }: AccountSelectorProps) {
    const firstAccountId = accounts[0]?.id;

    const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>(
    firstAccountId ? [firstAccountId] : []
    );

    function toggleAccount(accountId: string) {
        setSelectedAccountIds((currentIds) => {
            if (currentIds.includes(accountId)) {
                return currentIds.filter((id) => id !== accountId);
            }

            return [...currentIds, accountId];
        });
    }

    const selectedAccounts = accounts.filter((account) =>
        selectedAccountIds.includes(account.id)
    );

    if (accounts.length === 0) {
        return <p>No accounts found.</p>;
    }

    return (
        <section>
            <h2>Select Accounts</h2>

            <div>
                {accounts.map((account) => (
                    <label key={account.id} style={{ display:"block" }}>
                        <input
                            type="checkbox"
                            checked={selectedAccountIds.includes(account.id)}
                            onChange={() => toggleAccount(account.id)}
                        />
                        {account.name}
                    </label>
                ))}
            </div>
        </section>
    );
}
