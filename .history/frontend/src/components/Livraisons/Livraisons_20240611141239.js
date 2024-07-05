import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { UserContext } from "../Connexion/UserProvider";

const Livraisons = ({isSidebarOpen}) => {
  const [livraisons, setLivraisons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(5);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchLivraisons = async () => {
      try {
        const res = await axios.get("http://localhost:5000/livraisons");
        console.log(res.data);
        setLivraisons(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchLivraisons();
  }, [user]);


  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
  };

  const filtered = livraisons.filter((livraison) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      tier.code_tiers.toLowerCase().includes(searchTermLower) ||
      new Date(tier.date_creation)
        .toLocaleDateString()
        .includes(searchTermLower) ||
      tier.type.toString().includes(searchTermLower) ||
      tier.identite.toString().includes(searchTermLower)
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
                <h2 className="titre text-center">Liste des Livraisons</h2>
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
                  {user.role !== "comptable" && (
                    <Link to="/addLivraison">
                      <button type="button" className="btn btn-dark ml-2">
                        Ajouter une Livraison
                      </button>
                    </Link>
                  )}{" "}
              </div>
                
                <div className="table-responsive pt-3">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Date du Bon de Livraison</th>
                        <th>N° du Bon de Livraison</th>
                        <th>Code Tiers</th>
                        <th>Reference Commande</th>
                        <th>
                          Montant Total du <br></br>Bon de Livraison
                        </th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((livraison, index) => (
                        <tr key={index}>
                          <td>
                            {new Date(livraison.date_BL).toLocaleDateString()}
                          </td>
                          <td>{livraison.num_BL}</td>
                          <td>{livraison.code_tiers}</td>
                          <td>{livraison.reference_commande}</td>
                          <td>{livraison.montant_total_BL}</td>
                          <td>
                            <Link to={`/detailsLivraison/${livraison.id}`}>
                              <button type="button" className="btn btn-primary">
                                Détails
                              </button>
                            </Link>
                            &nbsp; &nbsp;
                            <Link to={`/updateLivraison/${livraison.id}`}>
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

export default Livraisons;
