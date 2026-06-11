"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormError } from "../shared/FormError";

type PayBillButtonProps = {
    billId: string;
    isPaid: boolean;
}

// Marks an unpaid bill as paid and hides itself once the bill is already paid.
export function PayBillButton({ billId, isPaid }: PayBillButtonProps) {
    const router = useRouter();
    const [isPaying, setIsPaying] = useState(false);
    const [error, setError] = useState("");

    async function handlePayBill() {
        setError("");
        setIsPaying(true);

        const response = await fetch (`/api/bills/${billId}/pay`, {
            method: "POST",
        });

        const data = await response.json();

        if (!response.ok) {
            setError(data.error || "Failed to pay bill.");
            return;
        }

        router.refresh();
    }

    if (isPaid) {
        return null;
    }

    return (
        <div>
            <button 
                type="button"
                className="bill-action-button bill-pay-button"
                onClick={handlePayBill}
                disabled={isPaying}
            >
                {isPaying ? "Paying..." : "Mark As Paid"}
            </button>

            <FormError message={error}/>
        </div>
    );
}
