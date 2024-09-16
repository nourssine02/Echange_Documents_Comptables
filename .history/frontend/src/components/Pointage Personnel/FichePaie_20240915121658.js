import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import UploadFile from "./UploadFile";
import { UserContext } from "../Connexion/UserProvider";
import "jspdf-autotable";
import ReactPaginate from "react-paginate";

const FichePaie = ({ isSidebarOpen }) => {
  const [fiches, setFiches] = useState([]);
  const [detailsVisible, setDetailsVisible] = useState({});
  const { user } = useContext(UserContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(5);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await axios.get("http://localhost:5000/clients");
        setClients(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    const fetchFiches = async () => {
      try {
        const res = await axios.get("http://localhost:5000/pointage", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            code_entreprise: selectedClient || undefined,
          },
        });
        setFiches(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchFiches();
  }, [selectedClient]);

  // Filter fiches by search term and selected client
  const filteredFiches = fiches.filter((fiche) => {
    const searchTermLower = searchTerm.toLowerCase();
    const isInClient =
      !selectedClient || fiche.code_entreprise === selectedClient;

    return (
      isInClient &&
      (fiche["CODE TIERS"].toLowerCase().includes(searchTermLower) ||
        fiche["NBRES DE JOURS OU D'H TRAVAILLES"]
          .toString()
          .includes(searchTermLower) ||
        fiche["NBRES DE JOURS OU D'H SUPP."]
          .toString()
          .includes(searchTermLower) ||
        fiche["IDENTITE DU TIERS"].toLowerCase().includes(searchTermLower) ||
        fiche["TYPE DE PAIE"].toLowerCase().includes(searchTermLower))
    );
  });

  const handleClientChange = (e) => {
    setSelectedClient(e.target.value);
    setCurrentPage(0);
  };

  const offset = currentPage * itemsPerPage;
  const currentItems = filteredFiches.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredFiches.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const toggleDetails = (ficheId) => {
    setDetailsVisible((prevDetailsVisible) => ({
      ...prevDetailsVisible,
      [ficheId]: !prevDetailsVisible[ficheId],
    }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
  };

  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? "shifted" : ""}`}>
        <div className="card">
          <div className="card-body">
            <h1 className="text-center">Table du Pointage Personnel</h1>
            <br />
            <br />
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

              {user.role === "comptable" && (
                <select
                  className="form-control w-auto mx-2"
                  style={{ color: "black" }}
                  value={selectedClient}
                  onChange={handleClientChange}
                >
                  {clients.map((client) => (
                    <option
                      key={client.code_entreprise}
                      value={client.code_entreprise}
                    >
                      {`${client.code_entreprise} - ${client.identite}`}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="table-responsive table-sm pt-3">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Code Tiers</th>
                    <th>Identité du Tiers</th>
                    <th>Type de Paie</th>
                    <th>Jours/H Travaillés</th>
                    <th>Jours/H Supp</th>
                    <th>Jours/H d'Absence</th>
                    <th>Congé Annuel</th>
                    <th>Autres Congés</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((fiche) => (
                    <React.Fragment key={fiche.id}>
                      <tr>
                        <td>{fiche["CODE TIERS"]}</td>
                        <td>{fiche["IDENTITE DU TIERS"]}</td>
                        <td>{fiche["TYPE DE PAIE"]}</td>
                        <td>{fiche["NBRES DE JOURS OU D'H TRAVAILLES"]}</td>
                        <td>{fiche["NBRES DE JOURS OU D'H SUPP."]}</td>
                        <td>{fiche["NBRES DE JOURS OU D'H D'ABSENCE"]}</td>
                        <td>{fiche["NBRES DE JOURS OU D'H DE CONGE ANNUEL"]}</td>
                        <td>{fiche["NBRES DE JOURS OU D'H AUTRES CONGES"]}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-info"
                            onClick={() => toggleDetails(fiche.id)}
                          >
                            {detailsVisible[fiche.id] ? "-" : "+"}
                          </button>
                        </td>
                      </tr>
                      {detailsVisible[fiche.id] && (
                        <tr>
                          <td colSpan="9">
                            <div className="details-section mt-3" style={{ display: "flex", flexDirection: "row"  , marginBottom: "10px"}}>
                              <div style={{ marginLeft: "10px" }}>
                                <strong>Supplement Reçu:</strong>{" "}
                                {fiche["SUPPLEMENT RECU"]}
                              </div>
                              <div style={{ marginLeft: "10px" }}>
                                <strong>Avances sur Salaires:</strong>{" "}
                                {fiche["AVANCES SUR SALAIRES"]}
                              </div>
                              <div style={{ marginLeft: "10px" }}>
                                <strong>Remboursement de Prets:</strong>{" "}
                                {fiche["REMBOURSEMENTS DE PRÊTS"]}
                              </div>
                              <div style={{ marginLeft: "10px" }}>
                                <strong>Autres Déductions:</strong>{" "}
                                {fiche["AUTRES DEDUCTIONS"]}
                              </div>
                              <div style={{ marginLeft: "10px" }}>
                                <strong>Observations:</strong> {fiche["OBSERVATIONS"]}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
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
  );
};

export default FichePaie;
