import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Facturations = ({isSidebarOpen}) => {
  const [factures, setFactures] = useState([]);

  useEffect(() => {
    const fetchFactures = async () => {
      try {
        const res = await axios.get("http://localhost:5000/facturations");
        setFactures(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchFactures();
  }, []);

  const handlePaymentStatusChange = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await axios.put(`http://localhost:5000/facture/${id}/etat_payement`, {
        etat_payement: newStatus,
      });
      setFactures((prevFactures) =>
        prevFactures.map((facture) =>
          facture.id === id ? { ...facture, etat_payement: newStatus } : facture
        )
      );
    } catch (err) {
      console.log("Error updating payment status:", err);
    }
  };

  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? 'shifted' : ''}`}>
      <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h2 className="titre">Liste des Facturations</h2>
                <br></br>
                <p className="card-description">
                  <Link to="/addFacture">
                    <button type="button" className="btn btn-info">
                      Ajouter une Facture
                    </button>
                  </Link>
                </p>
                <div className="table-responsive pt-3">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Date de la Facture</th>
                        <th>N° de la Facture</th>
                        <th>Code Tiers</th>
                        <th>Reference de la Livraison</th>
                        <th>
                          Montant Total de<br></br>la Facture
                        </th>
                        <th>Etat de Paiement</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {factures.map((facture, index) => (
                        <tr key={index}>
                          <td>
                            {new Date(facture.date_facture).toLocaleDateString()}
                          </td>
                          <td>{facture.num_facture}</td>
                          <td>{facture.code_tiers}</td>
                          <td>{facture.reference_livraison}</td>
                          <td>{facture.montant_total_facture}</td>
                          <td>
                            <input
                              type="checkbox"
                              checked={facture.etat_payement}
                              onChange={() =>
                                handlePaymentStatusChange(facture.id, facture.etat_payement)
                              }
                            />
                            <span
                              style={{
                                color: facture.etat_payement ? "green" : "red",
                                fontWeight: "bold",
                              }}
                            >
                              {facture.etat_payement ? " Payée" : " Non Payée"}
                            </span>
                          </td>
                          <td>
                            <Link to={`/detailsFacture/${facture.id}`}>
                              <button type="button" className="btn btn-primary">
                                Détails
                              </button>
                            </Link>
                            &nbsp; &nbsp;
                            <Link to={`/updateFacture/${facture.id}`}>
                              <button type="button" className="btn btn-success">
                                Modifier
                              </button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Facturations;
