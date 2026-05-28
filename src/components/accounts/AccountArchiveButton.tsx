"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type AccountArchiveButtonProps = {
    accountId: string;
    isArchived: boolean;
};

// Toggles an account between active and archived, then refreshes server data.
export function AccountArchiveButton({
    accountId,
    isArchived,
}: AccountArchiveButtonProps) {
    const router = useRouter();

    const [isUpdating, setIsUpdating] = useState(false);

    async function handleArchiveUpdate() {
        setIsUpdating(true);

        const response = await fetch(`/api/accounts/${accountId}/archive`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                isArchived: !isArchived,
            }),
        });

        setIsUpdating(false);

        if (!response.ok) {
            alert("Failed to update account.");
            return;
        }

        router.refresh();
    }

    return (
        <button
            type="button"
            onClick={handleArchiveUpdate}
            disabled={isUpdating}
            className={isArchived ? "secondary-button" : "danger-button"}
        >
            {isUpdating
                ? "Updating..."
                : isArchived
                    ? "Restore"
                    : "Archive"}
        </button>
    );
}
