"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormError } from "../shared/FormError";
import { Modal } from "../shared/Modal";
import { ModalActions } from "../shared/ModalActions";

export function AddAccountModal() {
    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState("");
    const [type, setType] = useState("CHEQUING");
    const [balance, setBalance] = useState("");

    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    function resetForm() {
        setName("");
        setType("CHEQUING");
        setBalance("");
        setError("");
    }

    function closeModal() {
        resetForm();
        setIsOpen(false);
    }

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        setError("");
        setIsSubmitting(true);

        try {

            const res = await fetch("/api/accounts", {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    type,
                    balance,
                })
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Failed to create account.");
                return;
            }

            closeModal();
            router.refresh();
        } catch {
            setError("Something went wrong while creating the account.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <>
            <button
                type="button"
                className="primary-button"
                onClick={() => setIsOpen(true)}
            >
                Add Account
            </button>

            <Modal isOpen={isOpen} title="Add Account" onClose={closeModal}>
                <form onSubmit={handleSubmit} className="transaction-form">
                    <div className="transaction-form-header">
                        <p className="transaction-form-eyebrow">New Account</p>
                        <p className="transaction-form-description">
                            Add an account to track its balance and transactions.
                        </p>
                    </div>

                    <FormError message={error} />

                    <div className="form-field">
                        <label htmlFor="account-name">Account name</label>
                        <input 
                            id="account-name"
                            type="text"
                            placeholder="Everyday Chequing"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="account-type">Account type</label>
                        <select
                            id="account-type"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            required
                        >
                            <option value="CHEQUING">Chequing</option>
                            <option value="SAVINGS">Savings</option>
                            <option value="CREDIT_CARD">Credit Card</option>
                            <option value="CASH">Cash</option>
                            <option value="INVESTMENT">Investment</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>

                    <div className="form-field">
                        <label htmlFor="account-balance">Starting balance</label>
                        <input
                            id="account-balance"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={balance}
                            onChange={(e) => setBalance(e.target.value)}
                            className="no-spinner"
                            required
                        />
                    </div>

                    <ModalActions
                        onCancel={closeModal}
                        isSaving={isSubmitting}
                        submitLabel="Add Acount"
                        savingLabel="Adding..."
                    />

                </form>
            </Modal>
        </>
    );
}
