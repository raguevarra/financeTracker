// Modal for adding bills in the account view

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "./Modal";
import { FormError } from "./FormError";
import { ModalActions } from "./ModalActions";

type AddBillModalProps = {
    accountId: string;
};

export function AddBillModal({ accountId }: AddBillModalProps) {
    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);

    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [dueDate, setDueDate] = useState("");

    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    function resetForm() {
        setName("");
        setAmount("");
        setDueDate("");
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

        const res = await fetch("/api/bills", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                name,
                amount,
                dueDate,
                accountId,
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error || "Failed to create bill.");
            setIsSubmitting(false);
            return;
        }

        setIsSubmitting(false);
        closeModal();
        router.refresh();
    }

    return (
        <>
            <button type="button" onClick={() => setIsOpen(true)}>
                Add Bill
            </button>

            <Modal
                isOpen={isOpen}
                title="Add Bill"
                onClose={closeModal}
            >
                <form onSubmit={handleSubmit}>
                    <FormError message={error}/>

                    <div>
                        <label htmlFor="bill-name">Name</label>
                        <input
                            id="bill-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="bill-amount">Amount</label>
                        <input
                            id="bill-amount"
                            type="number"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="bill-due-date">Due Date</label>
                        <input
                            id="bill-due-date"
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <ModalActions
                            onCancel={closeModal}
                            isSaving={isSubmitting}
                            submitLabel="Add Bill"
                            savingLabel="Submitting..."
                        />
                    </div>
                </form>
            </Modal>
        </>
    )
}