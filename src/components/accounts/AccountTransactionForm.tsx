"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormError } from "../shared/FormError";

type AccountTransactionFormProps = {
    accountId: string;
};

// Adds a transaction directly to the current account detail page.
export function AccountTransactionForm({ accountId }: AccountTransactionFormProps) {
    const router = useRouter();

    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [type, setType] = useState("DEBIT");
    const [date, setDate] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        setError("");
        setIsSubmitting(true);

        const res = await fetch("/api/transactions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                amount,
                type,
                date,
                accountId,
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error || "Failed to create the transaction.");
            setIsSubmitting(false);
            return;
        }

        setName("");
        setAmount("");
        setType("DEBIT");
        setDate("");
        setIsSubmitting(false);

        router.refresh();
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Add Transaction</h2>

            <FormError message={error}/>

            <div>
                <label htmlFor="transaction-name">Name</label>
                <input
                    id="transaction-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div>
                <label htmlFor="transaction-amount">Amount</label>
                <input
                    id="transaction-amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="no-spinner"
                    style={{
                        MozAppearance: "textfield",
                    }}
                />
            </div>

            <div>
                <label htmlFor="transaction-type">Type</label>
                <select
                    id="transaction-type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                >
                    <option value="DEBIT">Debit</option>
                    <option value="CREDIT">Credit</option>
                    <option value="TRANSFER">Transfer</option>
                </select>
            </div>

            <div>
                <label htmlFor="transaction-date">Date</label>
                <input
                    id="transaction-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
            </div>

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Transaction"}
            </button>
        </form>
    );
}
