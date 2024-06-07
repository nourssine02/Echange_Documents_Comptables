import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../Connexion/UserProvider";

const Sidebar = ({ isMinimized }) => {
  const { user } = useContext(UserContext);

  if (!user) {
    return null;
  }

  return (
<nav class="sidebar sidebar-offcanvas" id="sidebar">
      <ul className="nav" style={{ marginLeft: "10px" }}>
        <li className="nav-item">
          <Link className="nav-link" to="/home" data-toggle="collapse" aria-expanded="false">
            <i className="bi bi-grid menu-icon"></i>
            <span className="menu-title" style={{ fontSize: "14px" }}>
              Dashboard
            </span>
          </Link>
        </li>
        <li className="nav-item ">
          <a className="nav-link" href="/entreprises" data-toggle="collapse" aria-expanded="false">
            <i className="bi bi-building menu-icon"></i>
            <span className="menu-title" style={{ fontSize: "14px" }}>
              Liste des Entreprises
            </span>
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/users" data-toggle="collapse" aria-expanded="false">
            <i className="bi bi-people menu-icon"></i>
            <span className="menu-title" style={{ fontSize: "14px" }}>
              Liste des Utilisateurs
            </span>
          </a>
        </li>

        <li className="nav-item">
          <a className="nav-link" href="/tiers" data-toggle="collapse" aria-expanded="false">
            <i className="bi bi-person-add menu-icon"></i>
            <span className="menu-title" style={{ fontSize: "15px" }}>
              Liste des Tiers
            </span>
          </a>
        </li>

        <li className="nav-item">
          <a className="nav-link" href="/achats" data-toggle="collapse" aria-expanded="false">
            <i className="bi bi-bag menu-icon"></i>
            <span className="menu-title" style={{ fontSize: "14px" }}>
              Liste des Achats de <br></br> Biens et de Services{" "}
            </span>
          </a>
        </li>

        <li className="nav-item">
          <a className="nav-link" href="/reglements_emis" data-toggle="collapse" aria-expanded="false">
            <i className="icon fas fa-arrow-alt-circle-up menu-icon"></i>
            <span className="menu-title" style={{ fontSize: "14px" }}>
              Liste des Reglements <br></br>Emis
            </span>
          </a>
        </li>

        <li className="nav-item">
          <a className="nav-link" href="/commandes" data-toggle="collapse" aria-expanded="false">
            <i className="bi bi-cart4 menu-icon"></i>
            <span className="menu-title" style={{ fontSize: "14px" }}>
              Liste des Commandes
            </span>
          </a>
        </li>

        <li className="nav-item">
          <a className="nav-link" href="/livraisons" data-toggle="collapse" aria-expanded="false">
            <i className="bi bi-truck menu-icon"></i>
            <span className="menu-title" style={{ fontSize: "14px" }}>
              Liste des Livraisons
            </span>
          </a>
        </li>

        <li className="nav-item ">
          <a className="nav-link" href="/facturations" data-toggle="collapse" aria-expanded="false">
            <i className="bi bi-receipt menu-icon"></i>
            <span className="menu-title" style={{ fontSize: "14px" }}>
              Liste des Facturations
            </span>
          </a>
        </li>

        <li className="nav-item">
          <a className="nav-link" href="/reglements_recus" data-toggle="collapse" aria-expanded="false">
            <i className="icon fas fa-arrow-alt-circle-down menu-icon"></i>
            <span className="menu-title" style={{ fontSize: "14px" }}>
              Liste des Reglements <br></br>Reçus
            </span>
          </a>
        </li>

        <li className="nav-item">
          <a className="nav-link" href="/versements" data-toggle="collapse" aria-expanded="false">
            <i className="bi bi-bank menu-icon"></i>
            <span className="menu-title" style={{ fontSize: "14px" }}>
              Liste des Versements
            </span>
          </a>
        </li>

        <li className="nav-item">
          <a className="nav-link" href="/pointage" data-toggle="collapse" aria-expanded="false">
            <i className="bi bi-fingerprint menu-icon"></i>
            <span className="menu-title" style={{ fontSize: "14px" }}>
              Liste du Pointage <br></br>Personnel
            </span>
          </a>
        </li>

        <li className="nav-item">
          <a className="nav-link" href="/documents_comptabilite" data-toggle="collapse" aria-expanded="false">
            <i className="bi bi-files menu-icon"></i>
            <span className="menu-title" style={{ fontSize: "14px" }}>
              Liste des Documents <br></br> pour la Comptabilité
            </span>
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/document_direction" data-toggle="collapse" aria-expanded="false">
            <i className="bi bi-file-earmark menu-icon"></i>
            <span className="menu-title" style={{ fontSize: "14px" }}>
              Liste des Documents <br></br> pour la Direction
            </span>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
