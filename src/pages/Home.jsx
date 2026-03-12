import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useStore from "../hooks/useGlobalReducer";
import { ContactCard } from "../components/ContactCard";
import { CONTACTS_ENDPOINT, AGENDA_ENDPOINT } from "../config";

export const Home = () => {
    const { store, dispatch } = useStore();

    const loadContacts = async () => {
        dispatch({ type: "set_loading", payload: true });
        try {
            let res = await fetch(CONTACTS_ENDPOINT);
            // Si la agenda no existe (404), la crea y vuelve a pedir la lista
            if (res.status === 404) {
                await fetch(AGENDA_ENDPOINT, { method: "POST" });
                res = await fetch(CONTACTS_ENDPOINT);
            }
            const data = await res.json();
            // Guarda los contactos en el store global
            dispatch({ type: "assign_contacts", payload: data.contacts || [] });
        } catch (e) { console.error(e); }
        finally { dispatch({ type: "set_loading", payload: false }); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            const res = await fetch(`${CONTACTS_ENDPOINT}/${id}`, { method: "DELETE" });
            // Si se borra en API, se borra en store para actualizar la UI sin refrescar
            if (res.ok) dispatch({ type: "delete_contact", payload: id });
        } catch (e) { console.error(e); }
    };

    useEffect(() => { loadContacts(); }, []);

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="text-success h2">Spring Contacts List</h1>
                <Link to="/add" className="btn btn-success fw-bold px-4 rounded-pill shadow-sm">+ Add Contact</Link>
            </div>
            {store.isLoading ? (
                <div className="text-center mt-5"><div className="spinner-border text-success"></div></div>
            ) : (
                <ul className="list-group">
                    {store.contacts.map(c => <ContactCard key={c.id} contact={c} onDelete={handleDelete} />)}
                </ul>
            )}
        </div>
    );
};