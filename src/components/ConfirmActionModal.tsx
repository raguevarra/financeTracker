import { Modal } from "./Modal";

type ConfirmActionModalProps = {
    isOpen: boolean;
    title: string;
    message: React.ReactNode;
    confirmLabel: string;
    pendingLabel?: string;
    isPending: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    confirmClassName?: string;
};

export function ConfirmActionModal({
    isOpen,
    title,
    message,
    confirmLabel,
    pendingLabel = "Working...",
    isPending,
    onConfirm,
    onCancel,
    confirmClassName = "danger-button",
}: ConfirmActionModalProps) {
    return (
        <Modal isOpen={isOpen} title={title} onClose={onCancel}>
            <p className="muted">{message}</p>

            <div className="modal-actions">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isPending}
                    className="secondary-button"
                >
                    Cancel
                </button>

                <button
                    type="button"
                    onClick={onConfirm}
                    disabled={isPending}
                    className={confirmClassName}
                >
                    { isPending ? pendingLabel : confirmLabel }
                </button>
            </div>
        </Modal>
    );
}