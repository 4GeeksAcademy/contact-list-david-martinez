import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { ContactForm } from "../components/ContactForm";

const EMPTY_CONTACT = {
    name: "",
    email: "",
    phone: "",
    address: ""
};

export const AddContact = () => {
    const { actions, store } = useGlobalReducer();
    const { clearError, saveContact } = actions;
    const navigate = useNavigate();

    useEffect(() => {
        clearError();
    }, [clearError]);

    const handleCreate = async (contactValues) => {
        const wasSaved = await saveContact(contactValues);
        if (wasSaved) {
            navigate("/");
        }
    };

    return (
        <div className="container py-5">
            <ContactForm
                initialValues={EMPTY_CONTACT}
                isSubmitting={store.isSavingContact}
                onSubmit={handleCreate}
                serverError={store.error}
                submitLabel="Save Contact"
                title="Add New Spring Contact"
            />
        </div>
    );
};
