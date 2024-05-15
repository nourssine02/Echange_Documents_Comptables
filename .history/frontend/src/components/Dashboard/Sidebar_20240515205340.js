import React, { useContext } from 'react';
import { Link } from 'react-router-dom'; 

const Sidebar = () => {
  const [userData, setUserData] = useState({});

  return (
    <nav className="sidebar sidebar-offcanvas" id="sidebar">
      <ul className="nav" style={{ marginLeft: "10px" }}>
        {user && (
          <>
            {/* Afficher le tableau de bord pour tous les rôles */}
            <li className="nav-item">
              <Link className="nav-link" to="/home">
                <i className="bi bi-grid menu-icon"></i>
                <span className="menu-title" style={{ fontSize: '14px' }}>Dashboard</span>
              </Link>
            </li>
            {/* Afficher la liste des entreprises pour le super_admin */}
            {user.role === 'super_admin' && (
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
