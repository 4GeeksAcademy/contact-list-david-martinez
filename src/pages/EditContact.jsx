import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { ContactForm } from "../components/ContactForm";

const EMPTY_CONTACT = {
    name: "",
    email: "",
    phone: "",
    address: ""
};

export const EditContact = () => {
    const { id } = useParams();
    const { actions, store } = useGlobalReducer();
    const { clearError, findContactById, saveContact } = actions;
    const navigate = useNavigate();
    const [contact, setContact] = useState(EMPTY_CONTACT);
    const [contactNotFound, setContactNotFound] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            clearError();

            const loadedContact = await findContactById(id);

            if (loadedContact) {
                setContact({
                    name: loadedContact.name,
                    email: loadedContact.email,
                    phone: loadedContact.phone,
                    address: loadedContact.address
                });
                setContactNotFound(false);
            } else {
                setContact(EMPTY_CONTACT);
                setContactNotFound(true);
            }

            setLoading(false);
        };

        void load();
    }, [clearError, findContactById, id]);

    const handleUpdate = async (contactValues) => {
        const wasSaved = await saveContact(contactValues, id);
        if (wasSaved) {
            navigate("/");
        }
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-success" role="status"></div>
                <h2 className="text-success mt-2">Loading contact details...</h2>
            </div>
        );
    }

    if (contactNotFound) {
        return (
            <div className="container py-5">
                <div className="form-card text-center p-4">
                    <h1 className="h3 text-success mb-3">Contact not found</h1>
                    <p className="text-muted mb-4">
                        Reload the contacts list and try opening this contact again.
                    </p>
                    <Link className="btn btn-outline-success" to="/">
                        Back to contacts
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <ContactForm
                cancelLabel="Cancel and return"
                initialValues={contact}
                isSubmitting={store.isSavingContact}
                onSubmit={handleUpdate}
                serverError={store.error}
                submitLabel="Update Contact"
                title="Update Contact Info"
            />
        </div>
    );
};
