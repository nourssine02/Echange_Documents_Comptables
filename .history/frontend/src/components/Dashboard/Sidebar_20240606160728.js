  import React from "react";
  import { Link } from "react-router-dom";
  import "./Sidebar.css";

  const Sidebar = ({ isSidebarOpen, handleSidebarItemClick }) => {

    return (
      <nav className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <ul className="nav" style={{ marginLeft: "10px", marginTop: "70px" }}>
          <li className="nav-item">
            <Link className="nav-link" to="/home" >
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
            <Link className="nav-link" to="/users" >
              <i className="bi bi-people menu-icon"></i>
              <span className="menu-title" style={{ fontSize: "14px" }}>
                Liste des Utilisateurs
              </span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/tiers" >
              <i className="bi bi-person-plus menu-icon"></i>
              <span className="menu-title" style={{ fontSize: "15px" }}>
                Liste des Tiers
              </span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/achats" >
              <i className="bi bi-bag menu-icon"></i>
              <span className="menu-title" style={{ fontSize: "14px" }}>
                Liste des Achats de <br /> Biens et de Services{" "}
              </span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/reglements_emis" >
              <i className="icon fas fa-arrow-alt-circle-up menu-icon"></i>
              <span className="menu-title" style={{ fontSize: "14px" }}>
                Liste des Reglements <br /> Emis
              </span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/commandes" >
              <i className="bi bi-cart4 menu-icon"></i>
              <span className="menu-title" style={{ fontSize: "14px" }}>
                Liste des Commandes
              </span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/livraisons" >
              <i className="bi bi-truck menu-icon"></i>
              <span className="menu-title" style={{ fontSize: "14px" }}>
                Liste des Livraisons
              </span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/facturations" >
              <i className="bi bi-receipt menu-icon"></i>
              <span className="menu-title" style={{ fontSize: "14px" }}>
                Liste des Facturations
              </span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/reglements_recus" onClick={handleSidebarItemClick}>
              <i className="icon fas fa-arrow-alt-circle-down menu-icon"></i>
              <span className="menu-title" style={{ fontSize: "14px" }}>
                Liste des Reglements <br /> Reçus
              </span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/versements" onClick={handleSidebarItemClick}>
              <i className="bi bi-cash menu-icon"></i>
              <span className="menu-title" style={{ fontSize: "14px" }}>
                Liste des Versements
              </span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/pointage" onClick={handleSidebarItemClick} >
              <i className="bi bi-fingerprint menu-icon"></i>
              <span className="menu-title" style={{ fontSize: "14px" }}>
                Liste du Pointage <br /> Personnel
              </span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/documents_comptabilite" onClick={handleSidebarItemClick}>
              <i className="bi bi-files menu-icon"></i>
              <span className="menu-title" style={{ fontSize: "14px" }}>
                Liste des Documents <br /> pour la Comptabilité
              </span>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/document_direction" onClick={handleSidebarItemClick}>
              <i className="bi bi-file-earmark menu-icon"></i>
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
