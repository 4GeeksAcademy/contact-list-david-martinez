import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useStore from "../hooks/useGlobalReducer";
import { CONTACTS_ENDPOINT } from "../config";

export const EditContact = () => {
    const { id } = useParams();
    const { store } = useStore();
    const navigate = useNavigate();
    const [contact, setContact] = useState({ name: "", email: "", phone: "", address: "" });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            // Buscamos primero en el store global
            const inStore = store.contacts.find(c => c.id === parseInt(id));
            if (inStore) {
                setContact(inStore);
            } else {
                // Si no está (por un refresh), se pide a la API
                try {
                    const res = await fetch(`${CONTACTS_ENDPOINT}/${id}`);
                    if (res.ok) {
                        const data = await res.json();
                        setContact(data);
                    }
                } catch (e) { 
                    console.error("Error loading contact from API:", e); 
                }
            }
            setLoading(false);
        };
        load();
    }, [id, store.contacts]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        const updated = {
            name: contact.name.trim(),
            email: contact.email.trim(),
            phone: contact.phone.trim(),
            address: contact.address.trim()
        };
        try {
            const res = await fetch(`${CONTACTS_ENDPOINT}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updated)
            });
            if (res.ok) navigate("/");
        } catch (e) { 
            console.error("Error updating contact:", e); 
        }
    };

    if (loading) return (
        <div className="text-center mt-5">
            <div className="spinner-border text-success" role="status"></div>
            <h2 className="text-success mt-2">Loading contact details...</h2>
        </div>
    );

    return (
        <div className="container mt-5">
            <h1 className="text-success text-center mb-4">Update Contact Info</h1>
            <form onSubmit={handleUpdate} className="bg-white p-4 rounded shadow border border-success-subtle">
                <div className="mb-3">
                    <label className="form-label text-success fw-bold">Full Name</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        value={contact.name} 
                        onChange={e => setContact({...contact, name: e.target.value})} 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label text-success fw-bold">Email</label>
                    <input 
                        type="email" 
                        className="form-control" 
                        value={contact.email} 
                        onChange={e => setContact({...contact, email: e.target.value})} 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label text-success fw-bold">Phone</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        value={contact.phone} 
                        onChange={e => setContact({...contact, phone: e.target.value})} 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label text-success fw-bold">Address</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        value={contact.address} 
                        onChange={e => setContact({...contact, address: e.target.value})} 
                        required 
                    />
                </div>
                <button type="submit" className="btn btn-success w-100 fw-bold shadow-sm">Update Contact</button>
                <Link to="/" className="d-block text-center mt-3 text-success text-decoration-none small">
                    Cancel and return
                </Link>
            </form>
        </div>
    );
};