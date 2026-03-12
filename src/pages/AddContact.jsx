import React from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../hooks/useGlobalReducer";
import { ContactForm } from "../components/ContactForm";
import { CONTACTS_ENDPOINT } from "../config";

export const AddContact = () => {
    const navigate = useNavigate();
    const { store, dispatch } = useStore();

    const handleSave = async (formData) => {
        dispatch({ type: "set_saving", payload: true });
        try {
            // Envío de datos por POST a la API oficial
            const res = await fetch(CONTACTS_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (res.ok) navigate("/");
        } catch (e) { console.error(e); }
        finally { dispatch({ type: "set_saving", payload: false }); }
    };
    // Renderiza el componente de formulario configurado para creación
    return <div className="container mt-5"><ContactForm onSubmit={handleSave} title="Add New Contact" buttonLabel="Save Contact" isSaving={store.isSaving} /></div>;
};