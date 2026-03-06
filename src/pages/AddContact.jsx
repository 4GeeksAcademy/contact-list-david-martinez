import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AGENDA_ENDPOINT, CONTACTS_ENDPOINT } from "../config";

export const AddContact = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "" });

    const saveContact = async (e) => {
        e.preventDefault();
        const newContact = {
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            address: formData.address.trim()
        };

        if (!newContact.name || !newContact.email) return alert("Name and Email are required");

        try {
            // Aseguramos que la agenda exista antes de crear el contacto
            await fetch(AGENDA_ENDPOINT, { method: "POST" }); 
            
            const response = await fetch(CONTACTS_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newContact)
            });
            
            if (response.ok) navigate("/");
        } catch (error) { 
            console.error("Error saving contact:", error); 
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-success text-center mb-4">Add New Spring Contact</h1>
            <form onSubmit={saveContact} className="bg-white p-4 rounded shadow border border-success-subtle">
                <div className="mb-3">
                    <label className="form-label text-success fw-bold">Full Name</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Enter full name" 
                        onChange={e => setFormData({...formData, name: e.target.value})} 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label text-success fw-bold">Email</label>
                    <input 
                        type="email" 
                        className="form-control" 
                        placeholder="Enter email" 
                        onChange={e => setFormData({...formData, email: e.target.value})} 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label text-success fw-bold">Phone</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Enter phone" 
                        onChange={e => setFormData({...formData, phone: e.target.value})} 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label text-success fw-bold">Address</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Enter address" 
                        onChange={e => setFormData({...formData, address: e.target.value})} 
                        required 
                    />
                </div>
                <button type="submit" className="btn btn-success w-100 fw-bold shadow-sm">Save Contact</button>
                <Link to="/" className="d-block text-center mt-3 text-success text-decoration-none small">
                    <i className="fas fa-arrow-left me-1"></i> get back to contacts
                </Link>
            </form>
        </div>
    );
};