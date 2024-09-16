import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const CommandeDetailleesParPeriode = ({ isSidebarOpen }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [commandes, setCommandes] = useState([]);
  const [error, setError] = useState("");

  const fetchCommandes = async () => {
    if (!startDate || !endDate) {
      setError("Veuillez sélectionner les dates de début et de fin.");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError("La date de début ne peut pas être supérieure à la date de fin.");
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/commandes-par-periode", {
        params: { startDate, endDate },
      });
      setCommandes(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching commandes", error);
      setError("Une erreur est survenue lors de la récupération des commandes.");
    }
  };

  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? "shifted" : ""}`}>
        <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <Link style={{ fontSize: "25px" }} to="/requetes">
                  <i className="bi bi-arrow-left-circle"></i>
                </Link>
                <h3 className="text-center">Commandes Détailées par Période</h3>
                <br />
                <br />
                <br />
                <div className="d-flex justify-content-center mb-3">
                  <input
                    className="form-control form-control-sm w-auto mx-2"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <input
                    className="form-control form-control-sm w-auto mx-2"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                  <button className="btn btn-behance mx-2" onClick={fetchCommandes}>
                    Rechercher
                  </button>
                </div>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <br />
                {commandes.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Date de Commande</th>
                          <th>N° de Commande</th>
                          <th>Code Tiers</th>
                          <th>Tiers à Saisir</th>
                          <th>Montant</th>
                          <th>Date Livraison</th>
                          <th>Observations</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {commandes.map((commande) => (
                          <tr key={commande.id}>
                            <td>{new Date(commande.date_commande).toLocaleDateString()}</td>
                            <td>{commande.num_commande}</td>
                            <td>{commande.code_tiers}</td>
                            <td>{commande.tiers_saisie}</td>
                            <td>{commande.montant_commande}</td>
                            <td>{new Date(commande.date_livraison_prevue).toLocaleDateString()}</td>
                            <td>{commande.observations}</td>
                            <td>
                              <Link to={`/detailsCommande/${commande.id}`} className="btn btn-primary">
                                Détails
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center">Aucune commande trouvée pour cette période.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandeDetailleesParPeriode;
