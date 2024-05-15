import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("Utilisateur non authentifié");
          return;
        }

        const response = await axios.get("http://localhost:5000/home", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(response.data.user);
      } catch (error) {
        console.log("Erreur lors de la récupération des données");
      }
    };

    fetchUserData();
  }, []);

  return (
    <nav className="sidebar sidebar-offcanvas" id="sidebar">
      <ul className="nav" style={{ marginLeft: "10px" }}>
        {userData && (
          <>
            {/* Afficher le tableau de bord pour le super_admin */}
            {userData.role === "super_admin" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/home">
                    <i className="bi bi-grid menu-icon"></i>
                    <span className="menu-title" style={{ fontSize: "14px" }}>
                      Dashboard
                    </span>
                  </Link>
                </li>
                <li className="nav-item ">
                  <a className="nav-link" href="/entreprises">
                    <i className="bi bi-building menu-icon"></i>
                    <span className="menu-title" style={{ fontSize: "14px" }}>
                      Liste des Entreprises
                    </span>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/users">
                    <i className="bi bi-people menu-icon"></i>
                    <span className="menu-title" style={{ fontSize: "14px" }}>
                      Liste des Utilisateurs
                    </span>
                  </a>
                </li>

                <li className="nav-item">
                  <a className="nav-link" href="/tiers">
                    <i className="bi bi-person-add menu-icon"></i>
                    <span className="menu-title" style={{ fontSize: "15px" }}>
                      Liste des Tiers
                    </span>
                  </a>
                </li>

                <li className="nav-item">
                  <a className="nav-link" href="/achats">
                    <i className="bi bi-bag menu-icon"></i>
                    <span className="menu-title" style={{ fontSize: "14px" }}>
                      Liste des Achats de <br></br> Biens et de Services{" "}
                    </span>
                  </a>
                </li>

                <li className="nav-item">
                  <a className="nav-link" href="/reglements_emis">
                    <i className="icon fas fa-arrow-alt-circle-up menu-icon"></i>
                    <span className="menu-title" style={{ fontSize: "14px" }}>
                      Liste des Reglements <br></br>Emis
                    </span>
                  </a>
                </li>

                <li className="nav-item">
                  <a className="nav-link" href="/commandes">
                    <i className="bi bi-cart4 menu-icon"></i>
                    <span className="menu-title" style={{ fontSize: "14px" }}>
                      Liste des Commandes
                    </span>
                  </a>
                </li>

                <li className="nav-item">
                  <a className="nav-link" href="/livraisons">
                    <i className="bi bi-truck menu-icon"></i>
                    <span className="menu-title" style={{ fontSize: "14px" }}>
                      Liste des Livraisons
                    </span>
                  </a>
                </li>

                <li className="nav-item ">
                  <a className="nav-link" href="/facturations">
                    <i className="bi bi-receipt menu-icon"></i>
                    <span className="menu-title" style={{ fontSize: "14px" }}>
                      Liste des Facturations
                    </span>
                  </a>
                </li>

                <li className="nav-item">
                  <a className="nav-link" href="/reglements_recus">
                    <i className="icon fas fa-arrow-alt-circle-down menu-icon"></i>
                    <span className="menu-title" style={{ fontSize: "14px" }}>
                      Liste des Reglements <br></br>Reçus
                    </span>
                  </a>
                </li>

                <li className="nav-item">
                  <a className="nav-link" href="/versements">
                    <i className="bi bi-bank menu-icon"></i>
                    <span className="menu-title" style={{ fontSize: "14px" }}>
                      Liste des Versements
                    </span>
                  </a>
                </li>
              </>
            )}
          </>
        )}
      </ul>
    </nav>
  );
};

export default Sidebar;
