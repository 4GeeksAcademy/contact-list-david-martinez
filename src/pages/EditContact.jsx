import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useStore from "../hooks/useGlobalReducer";
import { ContactForm } from "../components/ContactForm";
import { CONTACTS_ENDPOINT } from "../config";

export const EditContact = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { store, dispatch } = useStore();
    const [contact, setContact] = useState(null);

    useEffect(() => {
        // Busca el contacto en el store local primero
        const found = store.contacts.find(c => c.id === parseInt(id));
        if (found) setContact(found);
        else {
            // Si el usuario recarga página, el store está vacío, lo pide a la API (Edición Robusta)
            fetch(`${CONTACTS_ENDPOINT}/${id}`)
                .then(res => res.ok ? res.json() : navigate("/"))
                .then(data => setContact(data))
                .catch(() => navigate("/"));
        }
    }, [id]);

    const handleUpdate = async (formData) => {
        dispatch({ type: "set_saving", payload: true });
        try {
            // Petición PUT para actualizar el contacto por su ID
            const res = await fetch(`${CONTACTS_ENDPOINT}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            if (res.ok) navigate("/");
        } catch (e) { console.error(e); }
        finally { dispatch({ type: "set_saving", payload: false }); }
    };
    // Muestra spinner hasta que el contacto esté listo para ser editado
    if (!contact) return <div className="text-center mt-5"><div className="spinner-border text-success"></div></div>;

    return <div className="container mt-5"><ContactForm initialData={contact} onSubmit={handleUpdate} title="Update Contact Info" buttonLabel="Update Contact" isSaving={store.isSaving} /></div>;
};