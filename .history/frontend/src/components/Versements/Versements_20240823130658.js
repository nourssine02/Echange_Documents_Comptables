import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../Connexion/UserProvider";
import ReactPaginate from "react-paginate";

const Versements = ({isSidebarOpen}) => {
  const [versements, setVersements] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(5);
  const { user } = useContext(UserContext);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");


  useEffect(() => {
    const fetchVersements = async () => {
      try {
        const res = await axios.get("http://localhost:5000/versements", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setVersements(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchClients = async () => {
      try {
        const res = await axios.get("http://localhost:5000/clients");
        setClients(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchVersements();
    fetchClients();
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

  const filteredVersementsByClient = versements.filter((versement) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      new Date(versement.date_versement)
        .toLocaleDateString()
        .includes(searchTermLower) ||
      versement.reference_bordereau_bulletin.toLowerCase().includes(searchTermLower)     );
  });

  const filteredVersementsByClient = selectedClient
  ? filteredLivraisons.filter((versement) => versement.identite === selectedClient)
  : filteredLivraisons;

  const offset = currentPage * itemsPerPage;
  const currentItems = filteredVersementsByClient.slice(
    offset,
    offset + itemsPerPage
  );
  const pageCount = Math.ceil(filteredVersementsByClient.length / itemsPerPage);

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
                      {currentItems.map((versement, index) => (
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

export default Versements;
