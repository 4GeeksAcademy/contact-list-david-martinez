import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useStore from "../hooks/useGlobalReducer";
import { CONTACTS_ENDPOINT, AGENDA_ENDPOINT } from "../config";

export const Home = () => {
    const { store, dispatch } = useStore();
    const [loadError, setLoadError] = useState("");

    const deleteContact = async (id) => {
        if (!window.confirm("Are you sure you want to delete this contact?")) return;

        try {
            const response = await fetch(`${CONTACTS_ENDPOINT}/${id}`, { method: "DELETE" });
            if (response.ok) {
                dispatch({ type: "delete_contact", payload: id });
                setLoadError("");
                return;
            }

            throw new Error("The contact could not be deleted.");
        } catch (error) {
            setLoadError(
                error instanceof Error ? error.message : "The contact could not be deleted."
            );
        }
    };

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                setLoadError("");

                let response = await fetch(CONTACTS_ENDPOINT);
                if (response.status === 404) {
                    await fetch(AGENDA_ENDPOINT, { method: "POST" });
                    response = await fetch(CONTACTS_ENDPOINT);
                }

                if (!response.ok) {
                    throw new Error("The contact list could not be loaded.");
                }

                const data = await response.json();
                dispatch({ type: "assign_contacts", payload: data.contacts ?? [] });
            } catch (error) {
                setLoadError(
                    error instanceof Error ? error.message : "The contact list could not be loaded."
                );
            }
        };

        fetchContacts();
    }, [dispatch]);

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="text-success h2">Spring Contacts List</h1>
                <Link to="/add" className="btn btn-success fw-bold px-4 rounded-pill shadow-sm">
                    <i className="fas fa-plus me-2"></i>Add New Contact
                </Link>
            </div>

            {loadError && (
                <div className="alert alert-danger shadow-sm" role="alert">
                    {loadError}
                </div>
            )}
            
            {store.contacts.length === 0 && (
                <div className="text-center mt-5 text-muted bg-white p-5 rounded shadow-sm border border-success-subtle">
                    <i className="fas fa-seedling fa-3x text-success mb-3"></i>
                    <h3>Your contact list is empty</h3>
                    <p>Click on &apos;Add New Contact&apos; to start growing your agenda.</p>
                </div>
            )}

            <ul className="list-group">
                {store.contacts.map((contact) => (
                    <li key={contact.id} className="list-group-item d-flex justify-content-between align-items-center bg-white p-3 shadow-sm mb-3 rounded-pill border-success-subtle hover-shadow">
                        <div className="d-flex align-items-center">
                            {contact.image_url ? (
                                <img 
                                    src={contact.image_url} 
                                    className="rounded-circle me-3 border border-2 border-success-subtle" 
                                    alt={contact.name} 
                                    style={{ width: "65px", height: "65px", objectFit: "cover" }} 
                                />
                            ) : (
                                <div 
                                    className="rounded-circle me-3 d-flex align-items-center justify-content-center bg-light text-secondary border border-2 border-success-subtle"
                                    style={{ width: "65px", height: "65px" }}
                                >
                                    <i className="fas fa-user fa-2x"></i>
                                </div>
                            )}

                            <div>
                                <h5 className="mb-1 text-dark fw-bold">{contact.name}</h5>
                                <p className="mb-0 text-secondary small"><i className="fas fa-map-marker-alt me-2 text-success"></i>{contact.address}</p>
                                <p className="mb-0 text-secondary small"><i className="fas fa-phone me-2 text-success"></i>{contact.phone}</p>
                                <p className="mb-0 text-secondary small"><i className="fas fa-envelope me-2 text-success"></i>{contact.email}</p>
                            </div>
                        </div>
                        <div className="d-flex flex-column align-items-end gap-2 me-2">
                            <Link to={`/edit/${contact.id}`} className="btn btn-outline-success btn-sm rounded-circle"><i className="fas fa-pencil-alt p-1"></i></Link>
                            <button
                                onClick={() => deleteContact(contact.id)}
                                className="btn btn-outline-danger btn-sm rounded-circle"
                                aria-label={`Delete ${contact.name}`}
                            >
                                <i className="fas fa-trash-alt p-1"></i>
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};
