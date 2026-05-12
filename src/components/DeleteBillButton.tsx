"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Modal } from "./Modal";

type DeleteBillButtonProps = {
    billId: string;
    billName?: string;
};

export function DeleteBillButton({ billId, billName }: DeleteBillButtonProps) {
    const router = useRouter();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

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
            <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="bill-delete-button"
            >
                Delete
            </button>

            <Modal
                isOpen={isModalOpen}
                title="Delete bill?"
                onClose={() => setIsModalOpen(false)}
            >
                <p className="muted">
                    Are you sure you want to delete{" "}
                    <strong>{billName ?? "this bill"}</strong>? This can’t be undone.
                </p>

                <div className="modal-actions">
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        disabled={isDeleting}
                        className="secondary-button"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="danger-button"
                    >
                        {isDeleting ? "Deleting..." : "Delete bill"}
                    </button>
                </div>
            </Modal>
        </>
    );
}