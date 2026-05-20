"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Modal } from "./Modal";
import { ConfirmActionModal } from "./ConfirmActionModal";

type DeleteBillButtonProps = {
    billId: string;
    billName?: string;
};

export function DeleteBillButton({ billId, billName }: DeleteBillButtonProps) {
    const router = useRouter();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState("");

    async function handleDelete() {
        setIsDeleting(true);

        const response = await fetch(`/api/bills/${billId}`, {
            method: "DELETE",
        });

        setIsDeleting(false);

        if (!response.ok) {
            alert("Failed to delete bill.");
            return;
        }

        setIsModalOpen(false);
        router.refresh();
    }

    return (
        <>
           {error && <p className="form-error">{error}</p>}

           <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="bill-delete-button"
            >
                Delete
            </button>

            <ConfirmActionModal
                isOpen={isModalOpen}
                title="Delete bill?"
                message={
                    <>
                        Are you sure you want to delete?{" "}
                        <strong>{billName ?? "this bill"}</strong>? This can't be undone.
                    </>
                }
                confirmLabel="Delete bill"
                pendingLabel="Deleting..."
                isPending={isDeleting}
                onConfirm={handleDelete}
                onCancel={() => setIsModalOpen(false)}
            />
        </>
    );
}