import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export const AddContact = () => {
    const navigate = useNavigate();

    // Estado local para capturar lo que el usuario escribe
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    // Función para enviar los datos a la API
    const saveContact = async (e) => {
    e.preventDefault();

    const newContact = {
        name: fullName,
        email: email,
        phone: phone,
        address: address
    };

    try {
        // Intentar crear la agenda por si acaso no existe
        await fetch("https://playground.4geeks.com/contact/agendas/david_martinez", {
            method: "POST"
        });

        // guardar el contacto
        const response = await fetch("https://playground.4geeks.com/contact/agendas/david_martinez/contacts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newContact)
        });

        if (response.ok) {
            navigate("/");
        } else {
            const errorData = await response.json();
            console.log("Detalle del error:", errorData);
            alert("Error al guardar: " + (errorData.detail || "revisa la consola"));
        }
    } catch (error) {
        console.error("Error de red:", error);
    }
};

    return (
        <div className="container mt-5">
            <h1 className="text-info text-center mb-4" style={{ textShadow: "0 0 10px #00d4ff" }}>Add New Contact</h1>
            <form onSubmit={saveContact} className="bg-dark p-4 rounded shadow-lg border border-secondary">
                <div className="mb-3">
                    <label className="form-label text-info">Full Name</label>
                    <input 
                        type="text" 
                        className="form-control bg-dark text-white border-secondary" 
                        placeholder="Full Name" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label text-info">Email</label>
                    <input 
                        type="email" 
                        className="form-control bg-dark text-white border-secondary" 
                        placeholder="Enter email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label text-info">Phone</label>
                    <input 
                        type="text" 
                        className="form-control bg-dark text-white border-secondary" 
                        placeholder="Enter phone" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label text-info">Address</label>
                    <input 
                        type="text" 
                        className="form-control bg-dark text-white border-secondary" 
                        placeholder="Enter address" 
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required 
                    />
                </div>
                <button type="submit" className="btn btn-info w-100 fw-bold shadow-sm">Save Contact</button>
                <Link to="/" className="d-block text-center mt-3 text-muted">or get back to contacts</Link>
            </form>
        </div>
    );
};