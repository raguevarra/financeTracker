"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type DeleteTransactionButtonProps = {
    transactionId: string;
    transactionName: string;
};

export function DeleteTransactionButton({
    transactionId,
    transactionName,
}: DeleteTransactionButtonProps) {
    const router = useRouter();

    const [error, setError] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    async function handleDelete() {
        const confirmed = window.confirm(
            `Delete "${transactionName}"? This cannot be undone.`
        );

        if (!confirmed) return;

        setError("");
        setIsDeleting(true);

        const response = await fetch(`/api/transactions/${transactionId}`, {
            method: "DELETE",
        });

        const data = await response.json();

        if (!response.ok) {
            setError(data.error || "Failed to delete transaction.");
            setIsDeleting(false);
            return;
        }

        setIsDeleting(false);
        router.refresh();
    }

    return(
        <div>
            {error && <p>{error}</p>}

            <button type="button" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete"}
            </button>
        </div>
    );
}