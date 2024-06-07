import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Connexion/UserProvider";

function Home({ isSidebarOpen }) {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

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

        setUser(response.data.user);
        console.log(response.data.user);
      } catch (error) {
        setError("Erreur lors de la récupération des données");
      }
    };

    fetchUserData();
  }, [setUser]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    // <div className={`main-panel ${isSidebarOpen ? 'shifted' : ''}`}>
    //   <div className="content-wrapper" style={{marginLeft: "250px"}}>
    <div className="container-fluid page-body-wrapper">
      <div class="main-panel">
        <div class="content-wrapper">
          <h2>Home</h2>
          {user && (
            <div>
              <p>ID User: {user.id}</p>
              <p>Identité: {user.identite}</p>
              <p>Rôle: {user.role}</p>
            </div>
          )}
          {error && <div>{error}</div>}
          <button onClick={handleLogout}>Se déconnecter</button>
        </div>
      </div>
    </div>
  );
}

export default Home;
