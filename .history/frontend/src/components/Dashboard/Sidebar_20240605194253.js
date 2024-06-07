import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../Connexion/UserProvider";
import "./Sidebar.css";

const Sidebar = ({ isSidebarOpen, handleSidebarItemClick }) => {

  return (
    <nav className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
      <ul className="nav" style={{ marginLeft: "10px", marginTop: "70px" }}>
        <li className="nav-item">
          <Link className="nav-link" to="/home" onClick={handleSidebarItemClick}>
            <span className="menu-title" style={{ fontSize: "14px" }}>
              Dashboard
            </span>
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/entreprises" onClick={handleSidebarItemClick}>
            <span className="menu-title" style={{ fontSize: "14px" }}>
              Liste des Entreprises
            </span>
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/users" onClick={handleSidebarItemClick}>
            <span className="menu-title" style={{ fontSize: "14px" }}>
              Liste des Utilisateurs
            </span>
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/tiers" onClick={handleSidebarItemClick}>
            <span className="menu-title" style={{ fontSize: "15px" }}>
              Liste des Tiers
            </span>
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/achats" onClick={handleSidebarItemClick}>
            <span className="menu-title" style={{ fontSize: "14px" }}>
              Liste des Achats de <br /> Biens et de Services
            </span>
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/reglements_emis" onClick={handleSidebarItemClick}>
            <span className="menu-title" style={{ fontSize: "14px" }}>
              Liste des Reglements <br /> Emis
            </span>
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/commandes" onClick={handleSidebarItemClick}>
            <span className="menu-title" style={{ fontSize: "14px" }}>
              Liste des Commandes
            </span>
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/livraisons" onClick={handleSidebarItemClick}>
            <span className="menu-title" style={{ fontSize: "14px" }}>
              Liste des Livraisons
            </span>
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/facturations" onClick={handleSidebarItemClick}>
            <span className="menu-title" style={{ fontSize: "14px" }}>
              Liste des Facturations
            </span>
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/reglements_recus" onClick={handleSidebarItemClick}>
            <span className="menu-title" style={{ fontSize: "14px" }}>
              Liste des Reglements <br /> Reçus
            </span>
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/versements" onClick={handleSidebarItemClick}>
            <span className="menu-title" style={{ fontSize: "14px" }}>
              Liste des Versements
            </span>
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/pointage" onClick={handleSidebarItemClick}>
            <span className="menu-title" style={{ fontSize: "14px" }}>
              Liste du Pointage <br /> Personnel
            </span>
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/documents_comptabilite" onClick={handleSidebarItemClick}>
            <span className="menu-title" style={{ fontSize: "14px" }}>
              Liste des Documents <br /> pour la Comptabilité
            </span>
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/document_direction" onClick={handleSidebarItemClick}>
            <span className="menu-title" style={{ fontSize: "14px" }}>
              Liste des Documents <br /> pour la Direction
            </span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
