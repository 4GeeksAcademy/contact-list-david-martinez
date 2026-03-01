import React, { useEffect } from "react";
import useStore from "../hooks/useGlobalReducer"; 
import { Link } from "react-router-dom";

export const Home = () => {
  // Extraigo el store (para leer los contactos) y el dispatch (para mandar las acciones al reducer)
  const { store, dispatch } = useStore();

  // --- FUNCIÓN PARA OBTENER CONTACTOS (GET) ---
  const getContacts = async () => {
    try {
      // Uso mi slug 'david_martinez' 
      const response = await fetch("https://playground.4geeks.com/contact/agendas/david_martinez/contacts");
      if (response.ok) {
        const data = await response.json();
        // Mando los contactos obtenidos al store global
        dispatch({ type: "assign_contacts", payload: data.contacts });
      }
    } catch (error) {
      console.log("Error cargando contactos", error);
    }
  };

  // --- FUNCIÓN PARA ELIMINAR UN CONTACTO (DELETE) ---
  const deleteContact = async (id) => {
    // Implemento una confirmación simple antes de borrar 
    if (window.confirm("¿Estás seguro de que deseas eliminar este contacto?")) {
      try {
        const response = await fetch(`https://playground.4geeks.com/contact/agendas/david_martinez/contacts/${id}`, {
          method: "DELETE"
        });
        if (response.ok) {
          // Si la API confirma el borrado, actualizo el estado global para que desaparezca de la pantalla
          dispatch({ type: "delete_contact", payload: id });
        }
      } catch (error) {
        console.log("Error al borrar:", error);
      }
    }
  };

  // Cargo los contactos automáticamente al montar el componente por primera vez
  useEffect(() => {
    getContacts();
  }, []);

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-info" style={{ textShadow: "0 0 15px #00d4ff", color: "#00d4ff" }}>Contact List</h1>
        {/* Enlace al formulario de creación */}
        <Link to="/add" className="btn btn-outline-success border-2 fw-bold">Add new contact</Link>
      </div>

      <div className="list-group">
        {/* RENDERIZADO CONDICIONAL: Si hay contactos los mapeo, si no, muestro un aviso */}
        {store.contacts && store.contacts.length > 0 ? (
          store.contacts.map((contact) => (
            <div key={contact.id} className="list-group-item bg-dark border-secondary mb-3 rounded shadow-lg p-4">
              <div className="row align-items-center">
                
                {/* AVATAR DINÁMICO: Uso Dicebear para generar una imagen única basada en el nombre */}
                <div className="col-md-3 text-center">
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${contact.name}`} 
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

                {/* INFO DEL CONTACTO */}
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

                {/* BOTONES EDITAR Y BORRAR */}
                <div className="col-md-2 d-flex justify-content-end align-items-start">
                  {/* Navego a la página de edición pasando el ID en la URL */}
                  <Link to={`/edit/${contact.id}`} className="btn btn-link text-info me-3 p-0">
                    <i className="fas fa-pencil-alt fs-5"></i>
                  </Link>
                  {/* Ejecuto la función de borrado al hacer clic */}
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
          <div className="text-center p-5 bg-dark border border-secondary rounded">
            <p className="text-white fst-italic">No hay contactos en tu agenda.</p>
          </div>
        )}
      </div>
    </div>
  );
};