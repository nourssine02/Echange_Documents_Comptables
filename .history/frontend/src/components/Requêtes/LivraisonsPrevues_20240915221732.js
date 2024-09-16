import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const LivraisonsPrevues = ({ isSidebarOpen }) => {
  const [livraisons, setLivraisons] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState("");

  const fetchLivraisons = async () => {
    if (!startDate || !endDate) {
      setError("Veuillez sélectionner les dates de début et de fin.");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError("La date de début ne peut pas être supérieure à la date de fin.");
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/livraisons-prevues", {
        params: { startDate, endDate },
      });
      setLivraisons(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching livraisons", error);
      setError("Une erreur est survenue lors de la récupération des livraisons prévues.");
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
                <h3 className="text-center">Livraisons Prévues</h3>
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
                  <button className="btn btn-behance mx-2" onClick={fetchLivraisons}>
                    Rechercher
                  </button>
                </div>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <br />
                {livraisons.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Date de la commande</th>
                          <th>N° de la commande</th>
                          <th>Code Tiers</th>
                          <th>Montant de la Commande</th>
                          <th color="">Date de livraison prévue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {livraisons.map((livraison, index) => (
                          <tr key={index}>
                            <td>{new Date(livraison.date_commande).toLocaleDateString()}</td>
                            <td>{livraison.num_commande}</td>
                            <td>{livraison.code_tiers}</td>
                            <td>{livraison.montant_commande} DT</td>
                            <td>{new Date(livraison.date_livraison_prevue).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center">Aucune livraison prévue pour cette période.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivraisonsPrevues;
