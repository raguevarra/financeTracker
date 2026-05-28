/*
Modal used across various components including:
    - Bill forms
    - Transaction forms
    - Adding/removing users to households
    - Setting account visibility
*/

"use client";

import type { ReactNode } from "react";

type ModalProps = {
    isOpen: boolean;
    title: string;
    children: ReactNode;
    onClose: () => void;
};

// Provides the shared modal shell used by forms and confirmation dialogs.
export function Modal({ isOpen, title, children, onClose }: ModalProps) {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-card" role="dialog" aria-modal="true">
                <div className="modal-header">
                    <h2>{title}</h2>

                    <button type="button" onClick={onClose} aria-label="Close modal">
                        ×
                    </button>
                </div>

                <div className="modal-content">
                    {children}
                </div>
            </div>
        </div>
    );
}
