import React, { useEffect, useState } from "react";
import useStore from "../hooks/useGlobalReducer"; 
import { Link } from "react-router-dom";
import { CONTACTS_ENDPOINT } from "../config/contactApi";

export const Home = () => {
  const { store, dispatch } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const getContacts = async () => {
    setIsLoading(true);
    setLoadError("");

    try {
      const response = await fetch(CONTACTS_ENDPOINT);

      if (response.status === 404) {
        dispatch({ type: "assign_contacts", payload: [] });
        return;
      }

      if (response.ok) {
        const data = await response.json();
        dispatch({ type: "assign_contacts", payload: data.contacts });
      } else {
        setLoadError("No se pudieron cargar los contactos. Intenta de nuevo.");
      }
    } catch (error) {
      setLoadError("Error de red al cargar contactos.");
      console.log("Error cargando contactos", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteContact = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este contacto?")) {
      try {
        const response = await fetch(`${CONTACTS_ENDPOINT}/${id}`, {
          method: "DELETE"
        });
        if (response.ok) {
          dispatch({ type: "delete_contact", payload: id });
        } else {
          alert("No se pudo eliminar el contacto.");
        }
      } catch (error) {
        console.log("Error al borrar:", error);
        alert("Error de red al eliminar contacto.");
      }
    }
  };

  useEffect(() => {
    getContacts();
  }, []); // Cargar al montar Home

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-info" style={{ textShadow: "0 0 15px #00d4ff", color: "#00d4ff" }}>Contact List</h1>
        <Link to="/add" className="btn btn-outline-success border-2 fw-bold">Add new contact</Link>
      </div>

      {isLoading && (
        <div className="text-center p-4 bg-dark border border-secondary rounded mb-3">
          <p className="mb-0 text-white">Cargando contactos...</p>
        </div>
      )}

      {!isLoading && loadError && (
        <div className="alert alert-danger" role="alert">
          {loadError}
        </div>
      )}

      <div className="list-group">
        {!isLoading && store.contacts && store.contacts.length > 0 ? (
          store.contacts.map((contact) => (
            <div key={contact.id} className="list-group-item bg-dark border-secondary mb-3 rounded shadow-lg p-4">
              <div className="row align-items-center">
                <div className="col-md-3 text-center">
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(contact.name)}`} 
                    className="rounded-circle border border-info p-1" 
                    style={{ 
                      width: "90px", 
                      height: "90px", 
                      objectFit: "cover",
                      background: "#212529",
                      boxShadow: "0 0 10px rgba(0, 212, 255, 0.5)" 
                    }} 
                    alt="avatar"
                  />
                </div>

                <div className="col-md-7">
                  <h5 className="text-info fw-bold mb-3">{contact.name}</h5>
                  <div className="contact-info">
                    <p className="mb-1 text-white d-flex align-items-center">
                      <i className="fas fa-map-marker-alt text-info me-3" style={{ width: "20px" }}></i>
                      <span>{contact.address}</span>
                    </p>
                    <p className="mb-1 text-white d-flex align-items-center">
                      <i className="fas fa-phone text-info me-3" style={{ width: "20px" }}></i>
                      <span>{contact.phone}</span>
                    </p>
                    <p className="mb-1 text-white d-flex align-items-center">
                      <i className="fas fa-envelope text-info me-3" style={{ width: "20px" }}></i>
                      <span>{contact.email}</span>
                    </p>
                  </div>
                </div>

                <div className="col-md-2 d-flex justify-content-end align-items-start">
                  <Link to={`/edit/${contact.id}`} className="btn btn-link text-info me-3 p-0">
                    <i className="fas fa-pencil-alt fs-5"></i>
                  </Link>
                  <button 
                    className="btn btn-link text-danger p-0" 
                    onClick={() => deleteContact(contact.id)}
                  >
                    <i className="fas fa-trash-alt fs-5"></i>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          !isLoading && (
            <div className="text-center p-5 bg-dark border border-secondary rounded">
            <p className="text-white fst-italic">No hay contactos en tu agenda.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};
