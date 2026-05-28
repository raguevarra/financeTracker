"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ConfirmActionModal } from "../shared/ConfirmActionModal";
import { FormError } from "../shared/FormError";

type DeleteTransactionButtonProps = {
  transactionId: string;
  transactionName: string;
};

export function DeleteTransactionButton({
  transactionId,
  transactionName,
}: DeleteTransactionButtonProps) {
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setError("");
    setIsDeleting(true);

    const response = await fetch(`/api/transactions/${transactionId}`, {
      method: "DELETE",
    });

    const data = await response.json();

    setIsDeleting(false);

    if (!response.ok) {
      setError(data.error || "Failed to delete transaction.");
      return;
    }

    setIsModalOpen(false);
    router.refresh();
  }

  return (
    <>
      <FormError message={error} />

      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        disabled={isDeleting}
      >
        Delete
      </button>

      <ConfirmActionModal
        isOpen={isModalOpen}
        title="Delete transaction?"
        message={
          <>
            Delete <strong>{transactionName}</strong>? This can’t be undone.
          </>
        }
        confirmLabel="Delete transaction"
        pendingLabel="Deleting..."
        isPending={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setIsModalOpen(false)}
      />
    </>
  );
}
