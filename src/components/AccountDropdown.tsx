"use client";

import { useRouter } from "next/navigation";

type AccountOption = {
    id: string;
    name: string;
};

type AccountDropdownProps = {
    accounts: AccountOption[];
    selectedAccountId: string;
};

export function AccountDropdown({
    accounts,
    selectedAccountId,
}: AccountDropdownProps) {
    const router = useRouter();

    return (
        <select
            value={selectedAccountId}
            onChange={(e) => {
                const accountId = e.target.value;
                router.push(`/accounts/${accountId}`);
            }}
        >
            {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                    {account.name}
                </option>
            ))}
        </select>
    );
}