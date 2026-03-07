import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const ContactCard = ({ contact }) => {
    const { actions, store } = useGlobalReducer();
    const isDeleting = store.deletingContactId === contact.id;

    const handleDelete = async () => {
        const wantsToDelete = window.confirm(
            `Are you sure you want to delete ${contact.name}?`
        );

        if (!wantsToDelete) return;

        await actions.deleteContact(contact.id);
    };

    return (
        <article className="card border-0 shadow-sm contact-card">
            <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                <div className="d-flex align-items-start gap-3">
                    <div className="contact-avatar" aria-hidden="true">
                        {contact.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>

                    <div>
                        <h2 className="h5 mb-2 text-dark fw-bold">{contact.name}</h2>
                        <p className="mb-1 text-secondary">
                            <i className="fas fa-map-marker-alt me-2 text-success"></i>
                            {contact.address}
                        </p>
                        <p className="mb-1 text-secondary">
                            <i className="fas fa-phone me-2 text-success"></i>
                            {contact.phone}
                        </p>
                        <p className="mb-0 text-secondary">
                            <i className="fas fa-envelope me-2 text-success"></i>
                            {contact.email}
                        </p>
                    </div>
                </div>

                <div className="d-flex gap-2">
                    <Link className="btn btn-outline-success" to={`/edit/${contact.id}`}>
                        Edit
                    </Link>
                    <button
                        className="btn btn-outline-danger"
                        disabled={isDeleting}
                        onClick={handleDelete}
                        type="button"
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </article>
    );
};

ContactCard.propTypes = {
    contact: PropTypes.shape({
        address: PropTypes.string.isRequired,
        email: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        phone: PropTypes.string.isRequired
    }).isRequired
};
