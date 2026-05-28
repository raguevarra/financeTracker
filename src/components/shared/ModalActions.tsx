type ModalActionProps = {
    onCancel: () => void;
    isSaving: boolean;
    submitLabel?: string;
    savingLabel?: string;
};

// Standard cancel/save button row for modal forms.
export function ModalActions({
    onCancel,
    isSaving,
    submitLabel = "Save changes",
    savingLabel = "Saving...",
}: ModalActionProps) {
    return (
        <div className="modal-actions">
            <button
                type="button"
                onClick={onCancel}
                disabled={isSaving}
                className="secondary-button"
            >
                Cancel
            </button>

            <button type="submit" disabled={isSaving}>
                {isSaving ? savingLabel : submitLabel}
            </button>
        </div>
    );
}
