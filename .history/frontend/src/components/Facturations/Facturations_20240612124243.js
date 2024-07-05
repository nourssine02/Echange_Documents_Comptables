import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
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
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="input-group" style={{ maxWidth: "300px" }}>
                    <input
                      type="search"
                      className="form-control"
                      placeholder="Rechercher..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                    <div className="input-group-append">
                      <span className="input-group-text">
                        <i className="fas fa-search"></i>
                      </span>
                    </div>
                  </div>
                  {user.role !== "comptable" && (
                    <Link to="/addFacture">
                      <button type="button" className="btn btn-dark">
                        Ajouter une Facture
                      </button>
                    </Link>
                  )}{" "}
                </div>
                
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
                            {user.role !== "client" && (
                            <Link to={`/updateFacture/${facture.id}`}>
                              <button type="button" className="btn btn-success">
                                Modifier
                              </button>
                            </Link>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <br />
                <div className="d-flex justify-content-center mt-5">
                  <ReactPaginate
                    previousLabel={"← Précédent"}
                    nextLabel={"Suivant →"}
                    breakLabel={"..."}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination justify-content-center"}
                    pageClassName={"page-item"}
                    pageLinkClassName={"page-link"}
                    previousClassName={"page-item"}
                    previousLinkClassName={"page-link"}
                    nextClassName={"page-item"}
                    nextLinkClassName={"page-link"}
                    breakClassName={"page-item"}
                    breakLinkClassName={"page-link"}
                    activeClassName={"active"}
                  />
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
