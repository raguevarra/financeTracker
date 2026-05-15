"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AccountForm() {
    const router = useRouter();

    const [form, setForm] = useState({
        name: "",
        type: "CHEQUING",
        balance: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement >
    ) {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();

        setIsSubmitting(true);
        setError("");

        const res = await fetch("/api/accounts", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                name: form.name,
                type: form.type,
                balance: form.balance,
            }),
        });

        setIsSubmitting(false);

        if (!res.ok) {
            setError("Account failed to save.");
            return;
        }

        setForm({
            name: "",
            type: "CHEQUING",
            balance: "",
        });

        router.refresh();
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Add Account</h2>

            <input
                name="name"
                placeholder="Account name"
                value={form.name}
                onChange={handleChange}
            />

            <select name="type" value={form.type} onChange={handleChange}>
                <option value="CHEQUING">Chequing</option>
                <option value="SAVINGS">Savings</option>
                <option value="CREDIT">Credit</option>
                <option value="CASH">Cash</option>
                <option value="OTHER">Other</option>
            </select>

            <input
                name="balance"
                type="number"
                step="0.01"
                placeholder="Starting balance"
                value={form.balance}
                onChange={handleChange}
            />

            {error && <p>{error}</p>}

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Account"}
            </button>
        </form>
    );
}