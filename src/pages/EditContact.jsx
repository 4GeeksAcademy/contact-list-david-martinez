import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ContactForm } from "../components/ContactForm";
import useStore from "../hooks/useGlobalReducer";
import { CONTACTS_ENDPOINT } from "../config";
import { EMPTY_CONTACT, normalizeContact } from "../utils/contactForm";

export const EditContact = () => {
    const { id } = useParams();
    const { store } = useStore();
    const navigate = useNavigate();
    const [contact, setContact] = useState(EMPTY_CONTACT);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");

    useEffect(() => {
        let isMounted = true;

        const load = async () => {
            const parsedId = Number(id);

            if (Number.isNaN(parsedId)) {
                if (isMounted) {
                    setLoadError("The selected contact is invalid.");
                    setLoading(false);
                }
                return;
            }

            const inStore = store.contacts.find((storedContact) => storedContact.id === parsedId);
            if (inStore) {
                if (isMounted) {
                    setContact(normalizeContact(inStore));
                    setLoading(false);
                }
                return;
            }

            try {
                const response = await fetch(`${CONTACTS_ENDPOINT}/${id}`);
                if (!response.ok) {
                    throw new Error("The contact could not be loaded.");
                }

                const data = await response.json();
                if (isMounted) {
                    setContact(normalizeContact(data));
                }
            } catch (error) {
                if (isMounted) {
                    setLoadError(
                        error instanceof Error ? error.message : "The contact could not be loaded."
                    );
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        load();

        return () => {
            isMounted = false;
        };
    }, [id, store.contacts]);

    const handleUpdate = async (updatedContact) => {
        const response = await fetch(`${CONTACTS_ENDPOINT}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedContact),
        });

        if (!response.ok) {
            throw new Error("The contact could not be updated.");
        }

        navigate("/");
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border text-success" role="status"></div>
                <h2 className="text-success mt-2">Loading contact details...</h2>
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger shadow-sm" role="alert">
                    {loadError}
                </div>
                <Link to="/" className="btn btn-outline-success">
                    Return to contacts
                </Link>
            </div>
        );
    }

    return (
        <ContactForm
            initialValues={contact}
            title="Update Contact Info"
            submitLabel="Update Contact"
            onSubmit={handleUpdate}
        />
    );
};
