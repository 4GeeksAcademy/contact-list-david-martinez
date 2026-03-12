import React, { useState } from "react";
import { Link } from "react-router-dom";

// Formulario reutilizable para Add y Edit (Evita duplicar código como pediste en la correccion)

export const ContactForm = ({ initialData, onSubmit, title, buttonLabel, isSaving }) => {
    // Si recibe datos (Edit) los usa, si no (Add) empieza vacío
    const [formData, setFormData] = useState(initialData || { name: "", email: "", phone: "", address: "" });
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validación básica manual antes de enviar
        if (!formData.name.trim() || !formData.email.trim()) {
            setErrors({ global: "Name and Email are required" });
            return;
        }
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow border border-success-subtle">
            <h2 className="text-success text-center mb-4">{title}</h2>
            {errors.global && <div className="alert alert-danger">{errors.global}</div>}
            // Inputs controlados: actualizan el estado formData en cada cambio */
            <div className="mb-3">
                <label className="form-label text-success fw-bold">Full Name</label>
                <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="mb-3">
                <label className="form-label text-success fw-bold">Email</label>
                <input type="email" className="form-control" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
            </div>
            <div className="mb-3">
                <label className="form-label text-success fw-bold">Phone</label>
                <input type="text" className="form-control" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
            </div>
            <div className="mb-3">
                <label className="form-label text-success fw-bold">Address</label>
                <input type="text" className="form-control" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required />
            </div>
            //  Botón bloqueado si se está guardando para evitar doble envío *
            <button type="submit" className="btn btn-success w-100 fw-bold shadow-sm" disabled={isSaving}>{isSaving ? "Saving..." : buttonLabel}</button>
            <Link to="/" className="d-block text-center mt-3 text-success text-decoration-none small">Cancel and return</Link>
        </form>
    );
};