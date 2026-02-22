import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useStore from "../hooks/useGlobalReducer";

export const EditContact = () => {
    const { id } = useParams();
    const { store } = useStore();
    const navigate = useNavigate();

    const [contact, setContact] = useState({
        name: "",
        email: "",
        phone: "",
        address: ""
    });

    useEffect(() => {
        const contactToEdit = store.contacts.find(c => c.id === parseInt(id));
        if (contactToEdit) {
            setContact({
                name: contactToEdit.name,
                email: contactToEdit.email,
                phone: contactToEdit.phone,
                address: contactToEdit.address
            });
        }
    }, [id, store.contacts]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`https://playground.4geeks.com/contact/agendas/david_martinez/contacts/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(contact)
            });

            if (response.ok) {
                navigate("/");
            }
        } catch (error) {
            console.error("Error al actualizar:", error);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-info text-center mb-4" style={{ textShadow: "0 0 10px #00d4ff" }}>Edit Contact</h1>
            <form onSubmit={handleSubmit} className="bg-dark p-4 rounded shadow-lg border border-secondary">
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
                <button type="submit" className="btn btn-info w-100 fw-bold shadow-sm">Update Contact</button>
                <Link to="/" className="d-block text-center mt-3 text-muted">or get back to contacts</Link>
            </form>
        </div>
    );
};