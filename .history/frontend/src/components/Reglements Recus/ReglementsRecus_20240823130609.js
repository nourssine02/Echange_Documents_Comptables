import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../Connexion/UserProvider";
import ReactPaginate from "react-paginate";


const ReglementsRecus = ({isSidebarOpen}) => {
  
  const [reglements, setReglements] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(5);
  const { user } = useContext(UserContext);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");


  useEffect(() => {
    const fetchReglements = async () => {
      try {
        const res = await axios.get("http://localhost:5000/reglements_recus", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log(res.data);
        setReglements(res.data);
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

    fetchReglements();
    fetchClients();
  }, [user]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
  };

  const filtered = reglements.filter((reglement) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      reglement.code_tiers.toLowerCase().includes(searchTermLower) ||
      reglement.tiers_saisie.toLowerCase().includes(searchTermLower) ||
      reglement.num_facture.toLowerCase().includes(searchTermLower) ||
      new Date(reglement.date_facture).toLocaleDateString().includes(searchTermLower) ||
      reglement.montant_total_a_regler.toString().includes(searchTermLower) ||
      reglement.montant_total_facture.toString().includes(searchTermLower) 
    );
  });

  const filteredLivraisonsByClient = selectedClient
  ? filteredLivraisons.filter((livraison) => livraison.identite === selectedClient)
  : filteredLivraisons;

  const offset = currentPage * itemsPerPage;
  const currentItems = filteredLivraisonsByClient.slice(
    offset,
    offset + itemsPerPage
  );
  const pageCount = Math.ceil(filteredLivraisonsByClient.length / itemsPerPage);

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
                <h2 className="titre text-center">Liste des Règlements Reçus</h2>
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
                    <Link to="/addReglementRecu">
                      <button type="button" className="btn btn-dark">
                      Ajouter un Règlement Reçus
                      </button>
                    </Link>
                  )}
                </div>
                <div className="table-responsive pt-3">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Code Tiers</th>
                        <th>Tiers Saisie</th>
                        <th>
                          N° de la <br></br> Facture à Régler
                        </th>
                        <th>
                          Date de la <br></br> Facture à Régler
                        </th>
                        <th>
                          Montant de la <br></br> Facture à Régler
                        </th>
                        <th>Montant Total à Régler</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((reglement, index) => (
                        <tr key={index}>
                        
                          <td>{reglement.code_tiers}</td>
                          <td>{reglement.tiers_saisie}</td>
                          <td>{reglement.num_facture}</td>
                          <td>
                            {new Date(
                              reglement.date_facture
                            ).toLocaleDateString()}
                          </td>
                          <td>{reglement.montant_total_facture} DT</td> 
                          <td>{reglement.montant_total_a_regler} DT</td>                         
                          <td>
                            <Link to={`/detailsReglementRecu/${reglement.id}`}>
                              <button type="button" className="btn btn-primary">
                                Détails
                              </button>
                            </Link>
                            &nbsp; &nbsp;
                            <Link to={`/updateReglementRecu/${reglement.id}`}>
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
  )
}

export default ReglementsRecus
