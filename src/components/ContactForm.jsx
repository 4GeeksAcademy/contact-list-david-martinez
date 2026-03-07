import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const FIELDS = [
    { name: "name", label: "Full Name", type: "text", placeholder: "Enter full name" },
    { name: "email", label: "Email", type: "email", placeholder: "Enter email" },
    { name: "phone", label: "Phone", type: "text", placeholder: "Enter phone" },
    { name: "address", label: "Address", type: "text", placeholder: "Enter address" }
];

const EMPTY_ERRORS = {};

const getInitialFormState = (initialValues) => ({
    name: initialValues?.name || "",
    email: initialValues?.email || "",
    phone: initialValues?.phone || "",
    address: initialValues?.address || ""
});

export const ContactForm = ({
    cancelLabel = "Get back to contacts",
    initialValues,
    isSubmitting,
    onSubmit,
    serverError,
    submitLabel,
    title
}) => {
    const [formValues, setFormValues] = useState(getInitialFormState(initialValues));
    const [formErrors, setFormErrors] = useState(EMPTY_ERRORS);

    useEffect(() => {
        setFormValues(getInitialFormState(initialValues));
        setFormErrors(EMPTY_ERRORS);
    }, [initialValues]);

    const validateForm = () => {
        const nextErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formValues.name.trim()) nextErrors.name = "Full name is required.";
        if (!formValues.email.trim()) {
            nextErrors.email = "Email is required.";
        } else if (!emailRegex.test(formValues.email.trim())) {
            nextErrors.email = "Enter a valid email address.";
        }
        if (!formValues.phone.trim()) nextErrors.phone = "Phone is required.";
        if (!formValues.address.trim()) nextErrors.address = "Address is required.";

        setFormErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleChange = ({ target }) => {
        const { name, value } = target;

        setFormValues((currentValues) => ({
            ...currentValues,
            [name]: value
        }));

        if (formErrors[name]) {
            setFormErrors((currentErrors) => ({
                ...currentErrors,
                [name]: ""
            }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) return;

        await onSubmit({
            name: formValues.name.trim(),
            email: formValues.email.trim(),
            phone: formValues.phone.trim(),
            address: formValues.address.trim()
        });
    };

    return (
        <div className="form-card">
            <h1 className="text-success text-center mb-4">{title}</h1>

            <form onSubmit={handleSubmit}>
                {serverError && (
                    <div className="alert alert-danger" role="alert">
                        {serverError}
                    </div>
                )}

                {FIELDS.map(({ label, name, placeholder, type }) => (
                    <div className="mb-3" key={name}>
                        <label className="form-label text-success fw-bold" htmlFor={name}>
                            {label}
                        </label>
                        <input
                            className={`form-control ${formErrors[name] ? "is-invalid" : ""}`}
                            disabled={isSubmitting}
                            id={name}
                            name={name}
                            onChange={handleChange}
                            placeholder={placeholder}
                            type={type}
                            value={formValues[name]}
                        />
                        {formErrors[name] && (
                            <div className="invalid-feedback">{formErrors[name]}</div>
                        )}
                    </div>
                ))}

                <button className="btn btn-success w-100 fw-bold shadow-sm" disabled={isSubmitting} type="submit">
                    {isSubmitting ? "Saving..." : submitLabel}
                </button>
                <Link className="d-block text-center mt-3 text-success text-decoration-none small" to="/">
                    <i className="fas fa-arrow-left me-1"></i> {cancelLabel}
                </Link>
            </form>
        </div>
    );
};

ContactForm.propTypes = {
    cancelLabel: PropTypes.string,
    initialValues: PropTypes.shape({
        address: PropTypes.string,
        email: PropTypes.string,
        name: PropTypes.string,
        phone: PropTypes.string
    }),
    isSubmitting: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func.isRequired,
    serverError: PropTypes.string,
    submitLabel: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
};
