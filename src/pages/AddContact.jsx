import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useStore from "../hooks/useGlobalReducer";
import { AGENDA_ENDPOINT, CONTACTS_ENDPOINT } from "../config/contactApi";

export const AddContact = () => {
    const navigate = useNavigate();
    const { dispatch } = useStore();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: ""
    });
    const [formError, setFormError] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const saveContact = async (e) => {
        e.preventDefault();
        setFormError("");

        const newContact = {
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            address: formData.address.trim()
        };

        if (!newContact.name || !newContact.email || !newContact.phone || !newContact.address) {
            setFormError("Todos los campos son obligatorios.");
            return;
        }

        try {
            setIsSaving(true);

            // Crear agenda si no existe; si ya existe, la API puede responder error y seguimos.
            await fetch(AGENDA_ENDPOINT, { method: "POST" });

            const response = await fetch(CONTACTS_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newContact)
            });

            if (!response.ok) {
                const errorData = await response.json();
                setFormError(errorData.detail || "Error al guardar el contacto.");
                return;
            }

            const createdContactResponse = await response.json();
            const createdContact = createdContactResponse.contact || createdContactResponse;

            if (createdContact?.id) {
                dispatch({ type: "add_contact", payload: createdContact });
            }

            navigate("/");
        } catch (error) {
            console.error("Error de red:", error);
            setFormError("Error de red al guardar el contacto.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((previous) => ({ ...previous, [name]: value }));
    };

    return (
        <div className="container mt-5">
            <h1 className="text-info text-center mb-4" style={{ textShadow: "0 0 10px #00d4ff" }}>Add New Contact</h1>
            <form onSubmit={saveContact} className="bg-dark p-4 rounded shadow-lg border border-secondary">
                {formError && (
                    <div className="alert alert-danger" role="alert">
                        {formError}
                    </div>
                )}
                <div className="mb-3">
                    <label className="form-label text-info">Full Name</label>
                    <input 
                        type="text" 
                        name="name"
                        className="form-control bg-dark text-white border-secondary" 
                        placeholder="Full Name" 
                        value={formData.name}
                        onChange={handleChange}
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label text-info">Email</label>
                    <input 
                        type="email" 
                        name="email"
                        className="form-control bg-dark text-white border-secondary" 
                        placeholder="Enter email" 
                        value={formData.email}
                        onChange={handleChange}
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label text-info">Phone</label>
                    <input 
                        type="text" 
                        name="phone"
                        className="form-control bg-dark text-white border-secondary" 
                        placeholder="Enter phone" 
                        value={formData.phone}
                        onChange={handleChange}
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label text-info">Address</label>
                    <input 
                        type="text" 
                        name="address"
                        className="form-control bg-dark text-white border-secondary" 
                        placeholder="Enter address" 
                        value={formData.address}
                        onChange={handleChange}
                        required 
                    />
                </div>
                <button
                    type="submit"
                    className="btn btn-info w-100 fw-bold shadow-sm"
                    disabled={isSaving}
                >
                    {isSaving ? "Saving..." : "Save Contact"}
                </button>
                <Link to="/" className="d-block text-center mt-3 text-muted">or get back to contacts</Link>
            </form>
        </div>
    );
};
