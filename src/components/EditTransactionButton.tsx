// src/components/EditTransactionButton.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "./Modal";
import type { TransactionCardData } from "./TransactionCard";
import { toDateInputValue } from "@/lib/formatters";
import { FormError } from "./FormError";
import { ModalActions } from "./ModalActions";

type EditTransactionButtonProps = {
  transaction: TransactionCardData;
};

export function EditTransactionButton({
  transaction,
}: EditTransactionButtonProps) {
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState(transaction.name);
  const [amount, setAmount] = useState(
    transaction.type === "TRANSFER"
    ? String(transaction.amount)
    : String(Math.abs(Number(transaction.amount)))
  );
  const [type, setType] = useState(transaction.type);
  const [date, setDate] = useState(toDateInputValue(transaction.date));

  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function resetForm() {
    setName(transaction.name);
    setAmount(
      transaction.type === "TRANSFER"
      ? String(transaction.amount)
      : String(Math.abs(Number(transaction.amount)))
    );
    setType(transaction.type);
    setDate(toDateInputValue(transaction.date));
    setError("");
  }

  function closeModal() {
    resetForm();
    setIsModalOpen(false);
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setIsSaving(true);

    const response = await fetch(`/api/transactions/${transaction.id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name,
        amount,
        type,
        date,
        accountId: transaction.accountId,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Failed to update transaction.");
      setIsSaving(false);
      return;
    }

    setName(data.name);
    setAmount(String(data.amount));
    setType(data.type);
    setDate(toDateInputValue(data.date));

    setIsSaving(false);
    setIsModalOpen(false);
    router.refresh();
  }

  return (
    <>
      <button type="button" onClick={() => setIsModalOpen(true)}>
        Edit
      </button>

      <Modal
        isOpen={isModalOpen}
        title="Edit Transaction"
        onClose={closeModal}
      >
        <form onSubmit={handleSubmit}>
          <FormError message={error}/>

          <div>
            <label htmlFor={`edit-transaction-name-${transaction.id}`}>
              Name
            </label>
            <input
              id={`edit-transaction-name-${transaction.id}`}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor={`edit-transaction-amount-${transaction.id}`}>
              Amount
            </label>
            <input
              id={`edit-transaction-amount-${transaction.id}`}
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor={`edit-transaction-type-${transaction.id}`}>
              Type
            </label>
            <select
              id={`edit-transaction-type-${transaction.id}`}
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
            <label htmlFor={`edit-transaction-date-${transaction.id}`}>
              Date
            </label>
            <input
              id={`edit-transaction-date-${transaction.id}`}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <ModalActions
            onCancel={closeModal}
            isSaving={isSaving}
          />
        </form>
      </Modal>
    </>
  );
}