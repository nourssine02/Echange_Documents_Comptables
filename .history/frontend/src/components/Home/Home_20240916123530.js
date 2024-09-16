import React, { useEffect, useState, useContext } from "react"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Connexion/UserProvider";

function Home({ isSidebarOpen }) {
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalDeliveries: 0,
    unpaidInvoices: 0,
  });
  
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

    const fetchStatistics = async () => {
      try {
        const response = await axios.get("http://localhost:5000/statistics");
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching statistics", error);
        setError("Une erreur est survenue lors de la récupération des statistiques.");
      }
    };

    fetchUserData();
    fetchStatistics();
  }, [setUser, navigate, setError]);

  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? "shifted" : ""}`}>
        <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h2 className="text-center">Home</h2>
                <br /> <br /> <br />
                {error && <p style={{ color: "red" }}>{error}</p>}
                
                <div className="row text-center">
                  <div className="col-md-3">
                    <div className="stat-card">
                      <h4>Total Utilisateurs</h4>
                      <p>{stats.totalUsers}</p>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="stat-card">
                      <h4>Total Commandes</h4>
                      <p>{stats.totalOrders}</p>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="stat-card">
                      <h4>Total Livraisons</h4>
                      <p>{stats.totalDeliveries}</p>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="stat-card">
                      <h4>Factures Non Payées</h4>
                      <p>{stats.unpaidInvoices}</p>
                    </div>
                  </div>
                </div>
                
              </div>
              
              /************************* */
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
