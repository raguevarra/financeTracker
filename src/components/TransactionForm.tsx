"use client";

import { useState } from "react";

export function TransactionForm() {
    const [form, setForm] = useState({
        name: "",
        amount: "",
        date: "",
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }
    
    async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
        e.preventDefault();

        await fetch("/api/transactions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ 
                ...form,
                amount: Number(form.amount),
            }),
        });

        console.log("Transaction submitted:", form);
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange} />
            
            <input
                name="amount"
                placeholder="Amount"
                value={form.amount}
                onChange={handleChange} />

            <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange} />

            <button type="submit">Add Transaction</button>
        </form>
    );
}