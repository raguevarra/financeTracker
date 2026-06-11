"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Modal } from "../shared/Modal";
import type { BillCardData } from "./BillCard";
import { FormError } from "../shared/FormError";
import { ModalActions } from "../shared/ModalActions";

type EditBillButtonProps = {
  bill: BillCardData;
};

// Normalizes dates into the yyyy-mm-dd value expected by date inputs.
function toDateInputValue(date: Date | string) {
    if (typeof date === "string" && date.includes("T")) {
        return date.split("T")[0];
    }

    if (typeof date === "string") {
        return date;
    }

    return date.toISOString().split("T")[0];
}

// Opens a modal for editing bill details.
export function EditBillButton({ bill }: EditBillButtonProps) {
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState(bill.name);
  const [amount, setAmount] = useState(String(bill.amount));
  const [dueDate, setDueDate] = useState(toDateInputValue(bill.dueDate));

  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function resetForm() {
    setName(bill.name);
    setAmount(String(bill.amount));
    setDueDate(toDateInputValue(bill.dueDate));
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

    const response = await fetch(`/api/bills/${bill.id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name,
        amount,
        dueDate,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Failed to update bill.");
      setIsSaving(false);
      return;
    }

    setName(data.name);
    setAmount(String(data.amount));
    setDueDate(toDateInputValue(data.dueDate));

    setIsSaving(false);
    setIsModalOpen(false);
    router.refresh();

  }

  return (
    <>
      <button
        type="button"
        className="bill-action-button bill-edit-button"
        onClick={() => setIsModalOpen(true)}
      >
        Edit
      </button>

      <Modal
        isOpen={isModalOpen}
        title="Edit Bill"
        onClose={closeModal}
      >
        <form onSubmit={handleSubmit} className="transaction-form">
          <FormError message={error}/>

          <div className="form-field">
            <label htmlFor={`edit-bill-name-${bill.id}`}>Name</label>
            <input
              id={`edit-bill-name-${bill.id}`}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor={`edit-bill-amount-${bill.id}`}>Amount</label>
            <input
              id={`edit-bill-amount-${bill.id}`}
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor={`edit-bill-due-date-${bill.id}`}>Due Date</label>
            <input
              id={`edit-bill-due-date-${bill.id}`}
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
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
