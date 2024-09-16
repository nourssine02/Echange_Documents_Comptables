import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Connexion/UserProvider";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register the required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function Home({ isSidebarOpen }) {
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalRevenue: 0,
    productsSold: 0,
    activeCustomers: 0,
    pendingOrders: 0,
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
        // Mise à jour des nouvelles statistiques avec un autre contexte
        setStats({
          totalRevenue: response.data.totalRevenue,
          productsSold: response.data.productsSold,
          activeCustomers: response.data.activeCustomers,
          pendingOrders: response.data.pendingOrders,
        });
      } catch (error) {
        console.error("Error fetching statistics", error);
        setError("Une erreur est survenue lors de la récupération des statistiques.");
      }
    };

    fetchUserData();
    fetchStatistics();
  }, [setUser, navigate, setError]);

  // Data for Bar Chart (nouveau contexte)
  const barChartData = {
    labels: ["Revenu Total", "Produits Vendus", "Clients Actifs", "Commandes en Attente"],
    datasets: [
      {
        label: "Statistiques",
        data: [stats.totalRevenue, stats.productsSold, stats.activeCustomers, stats.pendingOrders],
        backgroundColor: ["#36A2EB", "#FFCE56", "#4BC0C0", "#FF6384"],
      },
    ],
  };

  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? "shifted" : ""}`}>
        <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h2 className="text-center mb-5">Dashboard</h2>
                <br />
                {error && <p style={{ color: "red" }}>{error}</p>}

                <div className="row text-center">
                  <div className="col-md-3">
                    <div className="stat-card">
                      <h4>Revenu Total</h4>
                      <p>{stats.totalRevenue} €</p>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="stat-card">
                      <h4>Produits Vendus</h4>
                      <p>{stats.productsSold}</p>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="stat-card">
                      <h4>Clients Actifs</h4>
                      <p>{stats.activeCustomers}</p>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="stat-card">
                      <h4>Commandes en Attente</h4>
                      <p>{stats.pendingOrders}</p>
                    </div>
                  </div>
                </div>

                {/* Bar Chart for Stats */}
                <div className="mt-5">
                  <h3 className="text-center">Graphique des Statistiques</h3>
                  <Bar data={barChartData} options={{ responsive: true, plugins: { legend: { display: true }}}} />
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
