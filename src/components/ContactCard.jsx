import React from "react";
import { Link } from "react-router-dom";

// Componente separado para la tarjeta de cada contacto (Separación de UI)
export const ContactCard = ({ contact, onDelete }) => (
    <li className="list-group-item d-flex justify-content-between align-items-center bg-white p-3 shadow-sm mb-3 rounded-pill border-success-subtle hover-shadow">
        <div className="d-flex align-items-center">
            <div className="rounded-circle me-3 d-flex align-items-center justify-content-center bg-light text-secondary border border-2 border-success-subtle" style={{ width: "65px", height: "65px" }}>
                <i className="fas fa-user fa-2x"></i>
            </div>
            {/* Datos del contacto inyectados desde props */}
            <div>
                <h5 className="mb-1 text-dark fw-bold">{contact.name}</h5>
                <p className="mb-0 text-secondary small"><i className="fas fa-map-marker-alt me-2 text-success"></i>{contact.address}</p>
                <p className="mb-0 text-secondary small"><i className="fas fa-phone me-2 text-success"></i>{contact.phone}</p>
                <p className="mb-0 text-secondary small"><i className="fas fa-envelope me-2 text-success"></i>{contact.email}</p>
            </div>
        </div>
        <div className="d-flex flex-column align-items-end gap-2 me-2">
            {/* Link para editar usando el id dinámico */}
            <Link to={`/edit/${contact.id}`} className="btn btn-outline-success btn-sm rounded-circle"><i className="fas fa-pencil-alt p-1"></i></Link>
            {/* Botón para borrar que dispara la función recibida del padre */}
            <button onClick={() => onDelete(contact.id)} className="btn btn-outline-danger btn-sm rounded-circle"><i className="fas fa-trash-alt p-1"></i></button>
        </div>
    </li>
);