// Home.js
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Connexion/UserProvider";

function Home({ isSidebarOpen }) {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext); // Assurez-vous d'avoir accès à `user`
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showModal, setShowModal] = useState(true);

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

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/clients`);
        setClients(res.data);
      } catch (err) {
        console.error("Error fetching clients:", err);
      }
    };

    if (user?.id) {
      fetchClients();
    }
  }, [user]);

  const handleClientSelect = (event) => {
    const clientId = event.target.value;
    const client = clients.find(c => c.id === clientId);
    setSelectedClient(client);
    setShowModal(false);
    // Load the client's data here (purchases, orders, deliveries, invoices)
  };

  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? "shifted" : ""}`}>
        <div className="row">
          {showModal && (
            <div className="modal" tabindex="-1" role="dialog" style={{ display: 'block' }}>
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Veuillez sélectionner un client</h5>
                    <button
                      type="button"
                      className="close"
                      data-dismiss="modal"
                      aria-label="Close"
                      onClick={() => setShowModal(false)}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="form-group">
                        <label htmlFor="clientSelect">Clients</label>
                        <select className="form-control" id="clientSelect" onChange={handleClientSelect}>
                          <option value="">Sélectionnez un client</option>
                          {clients.map((client) => (
                            <option key={client.id} value={client.id}>
                              {client.identite}
                            </option>
                          ))}
                        </select>
                      </div>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-dismiss="modal"
                      onClick={() => setShowModal(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>0
            </div>
          )}
          {selectedClient && (
            <div>
              <h2>Client: {selectedClient.identite}</h2>
              {/* Render lists of purchases, orders, deliveries, invoices for the selected client */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
