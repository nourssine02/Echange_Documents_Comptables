import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; 

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
            {/* Afficher  pour le super_admin */}
            {userData.role === 'super_admin' && (
              <li className="nav-item">
                <Link className="nav-link" to="/entreprises">
                  <i className="bi bi-building menu-icon" ></i>
                  <span className="menu-title" style={{fontSize: '14px'}}>Liste des Entreprises</span>
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
