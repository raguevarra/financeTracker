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
        className="primary-button"
        onClick={() => setIsOpen(true)}
        disabled={accounts.length === 0}
      >
        Add Transaction
      </button>

      <Modal isOpen={isOpen} title="Add Transaction" onClose={closeModal}>
        <form onSubmit={handleSubmit} className="transaction-form">
          <div className="transaction-form-header">
            <p className="transaction-form-eyebrow">New transaction</p>
            <p className="transaction-form-description">
              Add a transaction and assign it to one of your active accounts.
            </p>
          </div>

          <FormError message={error} />

          <div className="form-field">
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

          <div className="form-field">
            <label htmlFor="transaction-name">Name</label>
            <input
              id="transaction-name"
              type="text"
              placeholder="Groceries, paycheque, rent..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="transaction-amount">Amount</label>
              <input
                id="transaction-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="no-spinner"
                required
              />
            </div>

            <div className="form-field">
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
          </div>

          <div className="form-field">
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