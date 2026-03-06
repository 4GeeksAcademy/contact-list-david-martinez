import React from "react";
import { Link } from "react-router-dom"; // ESTA LÍNEA ES LA QUE FALTA

export const Navbar = () => {
    return (
        <nav className="navbar navbar-light bg-white mb-3 px-3 shadow-sm border-bottom border-success" style={{borderWidth: "3px"}}>
            <Link to="/" style={{textDecoration: "none"}}>
                <span className="navbar-brand mb-0 h1" style={{color: "#38a169"}}>
                    <i className="fas fa-leaf me-2"></i>
                    Contact List
                </span>
            </Link>
            <div className="ml-auto">
                <Link to="/add">
                    <button className="btn btn-success fw-bold px-4 shadow-sm" style={{borderRadius: "20px"}}>
                        + Add Contact
                    </button>
                </Link>
            </div>
        </nav>
    );
};