"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormError } from "../shared/FormError";

type AccountOption = {
    id: string;
    name: string;
};

type TransferFormProps = {
    accounts: AccountOption[];
    currentAccountId: string;
};

export function TransferForm({ accounts, currentAccountId }: TransferFormProps) {
    const router = useRouter();

    const [form, setForm] = useState({
        fromAccountId: currentAccountId,
        toAccountId: 
            accounts.find((account) => account.id !== currentAccountId)?.id ?? "",
        amount: "",
        date: "",
        name: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();

        setError("");

        if (form.fromAccountId === form.toAccountId) {
            setError("From and to accounts must be different");
            return;
        }

        setIsSubmitting(true);

        const res = await fetch("/api/transfers", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                fromAccountId: form.fromAccountId,
                toAccountId: form.toAccountId,
                amount: form.amount,
                date: form.date,
                name: form.name || undefined,
            }),
        });

        const data = await res.json();

        setIsSubmitting(false);

        if (!res.ok) {
            setError(data.error || "Transfer failed to save.");
            return;
        }

        setForm({
            fromAccountId: accounts[0]?.id ?? "",
            toAccountId: accounts[1]?.id ?? accounts[0]?.id ?? "",
            amount: "",
            date: "",
            name: "",
        });

        router.refresh();
    }

    if (accounts.length < 2) {
        return (
            <section>
                <h2>Transfer funds</h2>
                <p>You need at least two accounts to make a transfer.</p>
            </section>
        )
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Transfer funds</h2>

            <select
                name="fromAccountId"
                value={form.fromAccountId}
                onChange={handleChange}
                required
            >
                {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                        From: {account.name}
                    </option>
                ))}
            </select>

            <select
                name="toAccountId"
                value={form.toAccountId}
                onChange={handleChange}
                required
            >
                {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                        To: {account.name}
                    </option>
                ))}
            </select>

            <input
                name="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="amount"
                value={form.amount}
                onChange={handleChange}
                required
            />

            <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                required
            />

            <input
                name="name"
                placeholder="Note; optional"
                value={form.name}
                onChange={handleChange}
            />

            <FormError message={error}/>

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Transferring..." : "Transfer"}
            </button>
        </form>
    );
}
