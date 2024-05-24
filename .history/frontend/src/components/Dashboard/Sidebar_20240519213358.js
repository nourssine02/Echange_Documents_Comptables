import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../Connexion/UserProvider";

const Sidebar = () => {
  const { user } = useContext(UserContext);

  if (!user) {
    return null; // Or display a loading message
  }

  const isComptableExpert = user.role === "comptable";
  const isClient = user.role === "client";
  const isAdmin = user.role === "super_admin";

  return (
    <nav className="sidebar sidebar-offcanvas" id="sidebar">
      <ul className="nav" style={{ marginLeft: "10px" }}>
        {isAdmin && (
          <>
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
            <li className="nav-item">
              <Link className="nav-link" to="/users">
                <i className="bi bi-people menu-icon"></i>
                <span className="menu-title" style={{ fontSize: "14px" }}>
                  Liste des Utilisateurs
                </span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/tiers">
                <i className="bi bi-person-add menu-icon"></i>
                <span className="menu-title" style={{ fontSize: "15px" }}>
                  Liste des Tiers
                </span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/achats">
                <i className="bi bi-bag menu-icon"></i>
                <span className="menu-title" style={{ fontSize: "14px" }}>
                  Liste des Achats de Biens et de Services
                </span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/reglements_emis">
                <i className="icon fas fa-arrow-alt-circle-up menu-icon"></i>
                <span className="menu-title" style={{ fontSize: "14px" }}>
                  Liste des Reglements Emis
                </span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/commandes">
                <i className="bi bi-cart4 menu-icon"></i>
                <span className="menu-title" style={{ fontSize: "14px" }}>
                  Liste des Commandes
                </span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/livraisons">
                <i className="bi bi-truck menu-icon"></i>
                <span className="menu-title" style={{ fontSize: "14px" }}>
                  Liste des Livraisons
                </span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/facturations">
                <i className="bi bi-receipt menu-icon"></i>
                <span className="menu-title" style={{ fontSize: "14px" }}>
                  Liste des Facturations
                </span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/reglements_recus">
                <i className="icon fas fa-arrow-alt-circle-down menu-icon"></i>
                <span className="menu-title" style={{ fontSize: "14px" }}>
                  Liste des Reglements Reçus
                </span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/versements">
                <i className="bi bi-bank menu-icon"></i>
                <span className="menu-title" style={{ fontSize: "14px" }}>
                  Liste des Versements
                </span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/pointage">
                <i className="bi bi-fingerprint menu-icon"></i>
                <span className="menu-title" style={{ fontSize: "14px" }}>
                  Liste du Pointage Personnel
                </span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/documents_comptabilite">
                <i className="bi bi-files menu-icon"></i>
                <span className="menu-title" style={{ fontSize: "14px" }}>
                  Liste des Documents Comptabilité
                </span>
              </Link>
            </li>
          </>
        )}
        {isComptableExpert && (
          <>
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
            <li className="nav-item">
              <Link className="nav-link" to="/users">
                <i className="bi bi-people menu-icon"></i>
                <span className="menu-title" style={{ fontSize: "14px" }}>
                  Liste des Utilisateurs
                </span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/tiers">
                <i className="bi bi-person-add menu-icon"></i>
                <span className="menu-title" style={{ fontSize: "15px" }}>
                  Liste des Tiers
                </span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/achats">
                <i className="bi bi-bag menu-icon"></i>
                <span className="menu-title" style={{ fontSize: "14px" }}>
                  Liste des Achats de Biens et de Services
                </span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/reglements_emis">
                <i className="icon fas fa-arrow-alt-circle-up menu-icon"></i>
                <span className="menu-title" style={{ fontSize: "14px" }}>
                  Liste des Reglements Emis
                </span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/commandes">
                <i className="bi bi-cart4 menu-icon"></i>
                <span className="menu-title" style={{ fontSize: "14px" }}>
                  Liste des Commandes
                </span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/livraisons">
                <i className="bi bi-truck menu-icon"></i>
                <span className="menu-title" style={{ fontSize: "14px" }}>
                  Liste des Livraisons
                </span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/facturations">
                <i className="bi bi-receipt menu-icon"></i>
                <span className="menu-title" style={{ fontSize: "14px" }}>
                  Liste des Facturations
                </span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/reglements_recus">
                <i className="icon fas fa-arrow-alt-circle-down menu-icon"></i>
                <span className="menu-title" style={{ fontSize: "14px" }}>
                  Liste des Reglements Reçus
                </span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/versements">
                <i className="bi bi-bank menu-icon"></i>
                <span className="menu-title" style={{ fontSize: "14px" }}>
                  Liste des Versements
                </span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/pointage">
                <i className="bi bi-fingerprint menu-icon"></i>
                <span className="menu-title" style={{ fontSize: "14px" }}>
                  Liste du Pointage Personnel
                </span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/documents_comptabilite">
                <i className="bi bi-files menu-icon"></i>
                <span className="menu-title" style={{ fontSize: "14px" }}>
                  Liste des Documents Comptabilité
                </span>
              </Link>
            </li>
          </>
        )}
        {isClient && (
          <>
            <li className="nav-item">
              <Link className="nav-link" to="/home">
                <i className="bi bi-grid menu-icon"></i>
                <span className="menu-title" style={{ fontSize: "14px" }}>
                  Dashboard
                </span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/mes_informations">
                <i className="bi bi-info-circle menu-icon"></i>
                <span className="menu-title" style={{ fontSize: "14px" }}>
                  Mes Informations
                </span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/comptabilite">
                <i className="bi bi-calculator menu-icon"></i>
                <span className="menu-title" style={{ fontSize: "14px" }}>
                  Comptabilité
                </span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/achats">
                <i className="bi bi-bag menu-icon"></i>
                <span className="menu-title" style={{ fontSize: "14px" }}>
                  Achats
                </span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/ventes">
                <i className="bi bi-cart4 menu-icon"></i>
                <span className="menu-title" style={{ fontSize: "14px" }}>
                  Ventes
                </span>
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Sidebar;
