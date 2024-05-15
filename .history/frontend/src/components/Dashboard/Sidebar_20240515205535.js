import React from 'react';
import { Link } from 'react-router-dom'; 

const Sidebar = () => {
  const [userData, setUserData] = useState({});

  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Utilisateur non authentifié");
          return;
        }

        const response = await axios.get("http://localhost:5000/home", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(response.data.user);
      } catch (error) {
        setError("Erreur lors de la récupération des données");
      }
    };

    fetchUserData();
  }, []);

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
            {userData.role && (
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
