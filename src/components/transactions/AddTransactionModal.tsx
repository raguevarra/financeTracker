"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormError } from "../shared/FormError";
import { Modal } from "../shared/Modal";
import { ModalActions } from "../shared/ModalActions";

type AccountOption = {
  id: string;
  name: string;
};

type AddTransactionModalProps = {
  accounts: AccountOption[];
};

export function AddTransactionModal({ accounts }: AddTransactionModalProps) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("DEBIT");
  const [date, setDate] = useState("");
  const [accountId, setAccountId] = useState(accounts[0]?.id ?? "");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function resetForm() {
    setName("");
    setAmount("");
    setType("DEBIT");
    setDate("");
    setAccountId(accounts[0]?.id ?? "");
    setError("");
  }

  function closeModal() {
    resetForm();
    setIsOpen(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setIsSubmitting(true);

    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        amount,
        type,
        date,
        accountId,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Failed to create transaction.");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    closeModal();
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        disabled={accounts.length === 0}
      >
        Add Transaction
      </button>

      <Modal
        isOpen={isOpen}
        title="Add Transaction"
        onClose={closeModal}
      >
        <form onSubmit={handleSubmit}>
          <FormError message={error} />

          <div>
            <label htmlFor="transaction-account">Account</label>
            <select
              id="transaction-account"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              required
            >
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="transaction-name">Name</label>
            <input
              id="transaction-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="transaction-amount">Amount</label>
            <input
              id="transaction-amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="transaction-type">Type</label>
            <select
              id="transaction-type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            >
              <option value="DEBIT">Debit</option>
              <option value="CREDIT">Credit</option>
            </select>
          </div>

          <div>
            <label htmlFor="transaction-date">Date</label>
            <input
              id="transaction-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <ModalActions
            onCancel={closeModal}
            isSaving={isSubmitting}
            submitLabel="Add Transaction"
            savingLabel="Adding..."
          />
        </form>
      </Modal>
    </>
  );
}