import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../Connexion/UserProvider";

const Sidebar = () => {
  const { user } = useContext(UserContext);

  return (
    <nav className="sidebar sidebar-offcanvas" id="sidebar">
      <ul className="nav" style={{ marginLeft: "10px" }}>
        {user && (
          <>
            
            {/* Afficher la liste des entreprises pour le super_admin */}
            {user.role === "super_admin" && (
              <ul className="nav" style={{ marginLeft: "10px" }}>
                <li className="nav-item">
                  <Link className="nav-link" to="/home">
                    <i className="bi bi-grid menu-icon"></i>
                    <span className="menu-title" style={{ fontSize: "14px" }}>
                      Dashboard
                    </span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/entreprises">
                    <i className="bi bi-building menu-icon"></i>
                    <span className="menu-title" style={{ fontSize: "14px" }}>
                      Liste des Entreprises
                    </span>
                  </Link>
                </li>
              </ul>
            )}
            {/* Afficher la liste des utilisateurs pour le super_admin */}
            {user.role === "super_admin" && (
              <li className="nav-item">
                <Link className="nav-link" to="/users">
                  <i className="bi bi-people menu-icon"></i>
                  <span className="menu-title" style={{ fontSize: "14px" }}>
                    Liste des Utilisateurs
                  </span>
                </Link>
              </li>
            )}
          </>
        )}
      </ul>
    </nav>
  );
};

export default Sidebar;
