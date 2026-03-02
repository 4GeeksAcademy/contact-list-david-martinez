import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useStore from "../hooks/useGlobalReducer";
import { CONTACTS_ENDPOINT } from "../config/contactApi";

export const EditContact = () => {
    const { id } = useParams();
    const { store, dispatch } = useStore();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [formError, setFormError] = useState("");

    const [contact, setContact] = useState({
        name: "",
        email: "",
        phone: "",
        address: ""
    });

    useEffect(() => {
        const loadContact = async () => {
            setIsLoading(true);
            setFormError("");

            const contactId = parseInt(id);
            const contactInStore = store.contacts.find((item) => item.id === contactId);

            if (contactInStore) {
                setContact({
                    name: contactInStore.name || "",
                    email: contactInStore.email || "",
                    phone: contactInStore.phone || "",
                    address: contactInStore.address || ""
                });
                setIsLoading(false);
                return;
            }

            // Si el store está vacío o no tiene el contacto, intentamos cargarlo desde la API.
            try {
                const response = await fetch(`${CONTACTS_ENDPOINT}/${contactId}`);
                if (!response.ok) {
                    setFormError("No se pudo cargar el contacto para editar.");
                    setIsLoading(false);
                    return;
                }

                const apiContactResponse = await response.json();
                const apiContact = apiContactResponse.contact || apiContactResponse;

                setContact({
                    name: apiContact.name || "",
                    email: apiContact.email || "",
                    phone: apiContact.phone || "",
                    address: apiContact.address || ""
                });
            } catch (error) {
                console.error("Error al cargar contacto:", error);
                setFormError("Error de red al cargar contacto.");
            } finally {
                setIsLoading(false);
            }
        };

        loadContact();
    }, [id, store.contacts]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");

        const normalizedContact = {
            name: contact.name.trim(),
            email: contact.email.trim(),
            phone: contact.phone.trim(),
            address: contact.address.trim()
        };

        if (!normalizedContact.name || !normalizedContact.email || !normalizedContact.phone || !normalizedContact.address) {
            setFormError("Todos los campos son obligatorios.");
            return;
        }

        try {
            setIsSaving(true);
            const response = await fetch(`${CONTACTS_ENDPOINT}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(normalizedContact)
            });

            if (response.ok) {
                const updatedContactResponse = await response.json();
                const updatedContact = updatedContactResponse.contact || updatedContactResponse;

                if (updatedContact?.id) {
                    dispatch({ type: "update_contact", payload: updatedContact });
                }
                navigate("/");
            } else {
                const errorData = await response.json();
                setFormError(errorData.detail || "No se pudo actualizar el contacto.");
            }
        } catch (error) {
            console.error("Error al actualizar:", error);
            setFormError("Error de red al actualizar contacto.");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="container mt-5">
                <div className="alert alert-info text-center">Cargando contacto...</div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <h1 className="text-info text-center mb-4" style={{ textShadow: "0 0 10px #00d4ff" }}>Edit Contact</h1>
            <form onSubmit={handleSubmit} className="bg-dark p-4 rounded shadow-lg border border-secondary">
                {formError && (
                    <div className="alert alert-danger" role="alert">
                        {formError}
                    </div>
                )}
                <div className="mb-3">
                    <label className="form-label text-info fw-bold">Full Name</label>
                    <input type="text" className="form-control bg-dark text-white border-secondary" value={contact.name} onChange={(e) => setContact({...contact, name: e.target.value})} required />
                </div>
                <div className="mb-3">
                    <label className="form-label text-info fw-bold">Email</label>
                    <input type="email" className="form-control bg-dark text-white border-secondary" value={contact.email} onChange={(e) => setContact({...contact, email: e.target.value})} required />
                </div>
                <div className="mb-3">
                    <label className="form-label text-info fw-bold">Phone</label>
                    <input type="text" className="form-control bg-dark text-white border-secondary" value={contact.phone} onChange={(e) => setContact({...contact, phone: e.target.value})} required />
                </div>
                <div className="mb-3">
                    <label className="form-label text-info fw-bold">Address</label>
                    <input type="text" className="form-control bg-dark text-white border-secondary" value={contact.address} onChange={(e) => setContact({...contact, address: e.target.value})} required />
                </div>
                <button
                    type="submit"
                    className="btn btn-info w-100 fw-bold shadow-sm"
                    disabled={isSaving}
                >
                    {isSaving ? "Updating..." : "Update Contact"}
                </button>
                <Link to="/" className="d-block text-center mt-3 text-muted">or get back to contacts</Link>
            </form>
        </div>
    );
};
