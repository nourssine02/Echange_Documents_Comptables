// Home.js
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../Connexion/UserProvider";

function Home({ isSidebarOpen }) {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Utilisateur non authentifié");
          navigate("/");
          return;
        }

        const response = await axios.get("http://localhost:5000/home", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data.user);
      } catch (error) {
        setError("Erreur lors de la récupération des données");
      }
    };

    fetchUserData();
  }, [setUser, navigate, setError]);

  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? "shifted" : ""}`}>
        <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h2 className="text-center">Interrogations et Requêtes</h2>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <div className="col-md-4">
                <Link to={"/TotalCommandesParPeriode"}>
                  <button type="button" className="btn btn-success">
                    Total Commandes Par Periode
                  </button>
                </Link>

                <Link to={"/ListeClientsParPeriodeCreation"}>
                  <button type="button" className="btn btn-success">
                  Liste Des Clients Par Periode de Creation
                  </button>
                </Link>
                
                <Link to={"/EtatDeFacturation"}>
                  <button type="button" className="btn btn-success">
                    Etat De Facturation
                  </button>
                </Link>
                
                </div>
                
              
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
