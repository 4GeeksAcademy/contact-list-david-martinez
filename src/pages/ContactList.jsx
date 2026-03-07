import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ContactCard } from "../components/ContactCard";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const ContactList = () => {
    const { actions, store } = useGlobalReducer();
    const { loadContacts } = actions;

    useEffect(() => {
        void loadContacts();
    }, [loadContacts]);

    return (
        <div className="container py-5">
            <section className="main-surface">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                    <div>
                        <p className="text-success text-uppercase fw-bold small mb-1">
                            Day 20 review
                        </p>
                        <h1 className="text-success h2 mb-0">Spring Contacts List</h1>
                    </div>

                    <Link className="btn btn-success fw-bold px-4 rounded-pill shadow-sm" to="/add">
                        <i className="fas fa-plus me-2"></i>
                        Add New Contact
                    </Link>
                </div>

                {store.error && (
                    <div className="alert alert-danger d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                        <span>{store.error}</span>
                        <button
                            className="btn btn-outline-danger btn-sm"
                            disabled={store.isLoadingContacts}
                            onClick={() => void loadContacts()}
                            type="button"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {store.isLoadingContacts && (
                    <div className="text-center py-5">
                        <div className="spinner-border text-success" role="status"></div>
                        <p className="text-muted mt-3 mb-0">Loading contacts...</p>
                    </div>
                )}

                {!store.isLoadingContacts && store.contacts.length === 0 && (
                    <div className="empty-state text-center p-5 text-muted">
                        <i className="fas fa-seedling fa-3x text-success mb-3"></i>
                        <h2 className="h4">Your contact list is empty</h2>
                        <p className="mb-0">
                            Click on <strong>Add New Contact</strong> to start growing your agenda.
                        </p>
                    </div>
                )}

                {!store.isLoadingContacts && store.contacts.length > 0 && (
                    <div className="d-flex flex-column gap-3">
                        {store.contacts.map((contact) => (
                            <ContactCard contact={contact} key={contact.id} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};
