"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormError } from "../shared/FormError";

type AccountOption = {
    id: string;
    name: string;
};

type TransactionFormProps = {
    accounts: AccountOption[];
};

// Creates a transaction from a general account picker.
export function TransactionForm({ accounts }: TransactionFormProps) {
    const router = useRouter();

    const [form, setForm] = useState({
        name: "",
        amount: "",
        type: "DEBIT",
        date: "",
        accountId: accounts[0]?.id ?? "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Keeps the form object in sync with each named input.
    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    // Sends the transaction to the API and resets the form after a save.
    async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();

        setIsSubmitting(true);
        setError("");

        const res = await fetch("/api/transactions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: form.name,
                amount: form.amount,
                type: form.type,
                date: form.date,
                accountId: form.accountId,
            }),
        });
        
        setIsSubmitting(false);

        if (!res.ok) {
            setError("Transaction failed to save.");
            return;
        }

        setForm({
            name: "",
            amount: "",
            type: "DEBIT",
            date: "",
            accountId: accounts[0]?.id ?? "",
        });

        router.refresh();
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Add Transaction</h2>

            <input
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
            />

            <input
                name="amount"
                type="number"
                step="0.01"
                placeholder="Amount"
                value={form.amount}
                onChange={handleChange}
            />

            <select name="type" value={form.type} onChange={handleChange}>
                <option value="DEBIT">Debit</option>
                <option value="CREDIT">Credit</option>
                <option value="TRANSFER">Transfer</option>
            </select>

            <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
            />

            <select name="accountId" value={form.accountId} onChange={handleChange}>
                {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                        {account.name}
                    </option>
                ))}
            </select>

            <FormError message={error}/>

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Transaction"}
            </button>
        </form>
    );
}
