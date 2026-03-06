import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { EMPTY_CONTACT, normalizeContact, validateContact } from "../utils/contactForm";

// A single field definition keeps the add/edit form markup and validation messages aligned.
const FORM_FIELDS = [
    { name: "name", label: "Full Name", type: "text", placeholder: "Enter full name" },
    { name: "email", label: "Email", type: "email", placeholder: "Enter email" },
    { name: "phone", label: "Phone", type: "tel", placeholder: "Enter phone" },
    { name: "address", label: "Address", type: "text", placeholder: "Enter address" },
];

export function ContactForm({
    initialValues = EMPTY_CONTACT,
    title,
    submitLabel,
    onSubmit,
}) {
    const [formData, setFormData] = useState({ ...EMPTY_CONTACT, ...initialValues });
    const [fieldErrors, setFieldErrors] = useState({});
    const [submitError, setSubmitError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setFormData({ ...EMPTY_CONTACT, ...initialValues });
        setFieldErrors({});
        setSubmitError("");
    }, [initialValues]);

    const handleChange = ({ target: { name, value } }) => {
        setFormData((currentFormData) => ({
            ...currentFormData,
            [name]: value,
        }));

        if (fieldErrors[name]) {
            setFieldErrors((currentErrors) => ({
                ...currentErrors,
                [name]: "",
            }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const normalizedContact = normalizeContact(formData);
        const nextErrors = validateContact(normalizedContact);

        if (Object.keys(nextErrors).length > 0) {
            setFieldErrors(nextErrors);
            return;
        }

        setIsSubmitting(true);
        setSubmitError("");

        try {
            await onSubmit(normalizedContact);
        } catch (error) {
            setSubmitError(
                error instanceof Error ? error.message : "The contact could not be saved."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-success text-center mb-4">{title}</h1>
            <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow border border-success-subtle">
                {submitError && (
                    <div className="alert alert-danger" role="alert">
                        {submitError}
                    </div>
                )}

                {FORM_FIELDS.map(({ name, label, type, placeholder }) => (
                    <div className="mb-3" key={name}>
                        <label htmlFor={name} className="form-label text-success fw-bold">
                            {label}
                        </label>
                        <input
                            id={name}
                            name={name}
                            type={type}
                            className={`form-control ${fieldErrors[name] ? "is-invalid" : ""}`}
                            placeholder={placeholder}
                            value={formData[name]}
                            onChange={handleChange}
                            disabled={isSubmitting}
                        />
                        {fieldErrors[name] && (
                            <div className="invalid-feedback">{fieldErrors[name]}</div>
                        )}
                    </div>
                ))}

                <button
                    type="submit"
                    className="btn btn-success w-100 fw-bold shadow-sm"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Saving..." : submitLabel}
                </button>

                <Link to="/" className="d-block text-center mt-3 text-success text-decoration-none small">
                    <i className="fas fa-arrow-left me-1"></i>Back to contacts
                </Link>
            </form>
        </div>
    );
}

ContactForm.propTypes = {
    initialValues: PropTypes.shape({
        name: PropTypes.string,
        email: PropTypes.string,
        phone: PropTypes.string,
        address: PropTypes.string,
    }),
    title: PropTypes.string.isRequired,
    submitLabel: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
};
