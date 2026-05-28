type FormErrorProps = {
    message: string;
};

// Renders a form error only when there is a message to show.
export function FormError({ message }: FormErrorProps) {
    if (!message) return null;

    return <p className="form-error">{message}</p>
}
