import { useState } from "react";

export function useFormState<T>(initialValues: T) {
    const [form, setForm] = useState(initialValues);

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }

    function resetForm() {
        setForm(initialValues);
    }

    return { form, setForm, handleChange, resetForm };
}