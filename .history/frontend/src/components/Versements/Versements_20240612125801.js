import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../Connexion/UserProvider";

const Versements = ({isSidebarOpen}) => {
  const [versements, setVersements] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(5);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchVersements = async () => {
      try {
        const res = await axios.get("http://localhost:5000/versements");
        setVersements(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchVersements();
  }, [user]);

  const openImageViewer = (documentUrl) => {
    const imageWindow = window.open("", "_blank");
    const img = document.createElement("img");
    img.src = documentUrl;
    img.style.width = "40%";
    img.style.height = "100%";
    img.style.marginLeft = "350px";
    imageWindow.document.body.appendChild(img);
  };



  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
  };

  const filtered = factures.filter((facture) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      facture.num_facture.toString().includes(searchTermLower) ||
      facture.code_tiers.toLowerCase().includes(searchTermLower) ||
      new Date(facture.date_facture)
        .toLocaleDateString()
        .includes(searchTermLower) ||
      facture.reference_livraison.toString().includes(searchTermLower) ||
      facture.etat_payement.toLowerCase().includes(searchTermLower) ||
      facture.montant_total_facture.toString().includes(searchTermLower)
    );
  });

  const offset = currentPage * itemsPerPage;
  const currentItems = filtered.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filtered.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? 'shifted' : ''}`}>
      <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h2 className="titre text-center">Liste des Versements</h2>
                <br></br>
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
                  {user.role === "client" && (
                    <Link to="/addVersement">
                      <button type="button" className="btn btn-dark">
                        Ajouter un Versement
                      </button>
                    </Link>
                  )}
                </div>
                <p className="card-description">
                  <Link to="/addVersement">
                    <button type="button" className="btn btn-info">
                      Ajouter un Versement
                    </button>
                  </Link>
                </p>
                <div className="table-responsive pt-3">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Date de Versement</th>
                        <th>Reference Bordereau/Bulletin</th>
                        <th>Observations</th>
                        <th>Document/Fichier à Inserer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {versements.map((versement, index) => (
                        <tr key={index}>
                          <td>
                            {versement.date_versement
                              ? new Date(
                                  versement.date_versement
                                ).toLocaleDateString()
                              : ""}
                          </td>
                          <td>{versement.reference_bordereau_bulletin}</td>
                          <td>{versement.observations}</td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-link"
                              onClick={() =>
                                openImageViewer(versement.document_fichier)
                              }
                            >
                              View Document
                            </button>
                          </td>

                          <td>
                            <Link to={`/detailsVersement/${versement.id}`}>
                              <button type="button" className="btn btn-primary">
                                Détails
                              </button>
                            </Link>
                            &nbsp; &nbsp;
                            <Link to={`/updateVersement/${versement.id}`}>
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

export default Versements;
