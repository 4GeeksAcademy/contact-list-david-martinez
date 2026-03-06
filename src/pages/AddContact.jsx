import { useNavigate } from "react-router-dom";
import { ContactForm } from "../components/ContactForm";
import { AGENDA_ENDPOINT, CONTACTS_ENDPOINT } from "../config";

export const AddContact = () => {
    const navigate = useNavigate();

    const saveContact = async (contactData) => {
        // The playground API needs the agenda slug to exist before we can add contacts.
        await fetch(AGENDA_ENDPOINT, { method: "POST" });

        const response = await fetch(CONTACTS_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(contactData),
        });

        if (!response.ok) {
            throw new Error("The contact could not be created.");
        }

        navigate("/");
    };

    return (
        <ContactForm
            title="Add New Spring Contact"
            submitLabel="Save Contact"
            onSubmit={saveContact}
        />
    );
};
