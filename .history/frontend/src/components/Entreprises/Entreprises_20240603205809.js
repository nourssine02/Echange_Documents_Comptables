import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../Connexion/UserProvider";
import ReactPaginate from 'react-paginate';

const Entreprises = () => {
  const [entreprises, setEntreprises] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(5);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchEntreprises = async () => {
      try {
        let res;
        if (user.role === "comptable") {
          res = await axios.get("http://localhost:5000/entreprises", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
        } else {
          res = await axios.get("http://localhost:5000/entreprises/user", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
        }
        setEntreprises(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchEntreprises();
  }, [user]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
  };

  const filteredEntreprises = entreprises.filter((entreprise) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      entreprise.code_entreprise.toLowerCase().includes(searchTermLower) ||
      entreprise.identite.toLowerCase().includes(searchTermLower) ||
      entreprise.responsable.toLowerCase().includes(searchTermLower) ||
      entreprise.adresse.toLowerCase().includes(searchTermLower)
    );
  });

  const offset = currentPage * itemsPerPage;
  const currentItems = filteredEntreprises.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredEntreprises.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h2 className="font-medium text-center mb-5">Liste des Entreprises</h2>
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
                    <Link to="/addEntreprise">
                      <button type="button" className="btn btn-dark">
                        Ajouter une Entreprise
                      </button>
                    </Link>
                  )}
                </div>
                <div className="table-responsive pt-3">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Code Entreprise</th>
                        <th>Date de Creation</th>
                        <th>Identite</th>
                        <th>Responsable</th>
                        <th>Adresse</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((entreprise) => (
                        <tr key={entreprise.id}>
                          <td>{entreprise.code_entreprise}</td>
                          <td>{new Date(entreprise.date_creation).toLocaleDateString()}</td>
                          <td>{entreprise.identite}</td>
                          <td>{entreprise.responsable}</td>
                          <td>{entreprise.adresse}</td>
                          <td>
                            <Link to={`/detailsEntreprise/${entreprise.id}`}>
                              <button type="button" className="btn btn-primary">
                                Détails
                              </button>
                            </Link>
                            &nbsp;
                            <Link to={`/updateEntreprise/${entreprise.id}`}>
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
                <div className="d-flex justify-content-end mt-4">
                  <ReactPaginate
                    previousLabel={'← Précédent'}
                    nextLabel={'Suivant →'}
                    breakLabel={'...'}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}
                    onPageChange={handlePageClick}
                    containerClassName={'pagination justify-content-center'}
                    pageClassName={'page-item'}
                    pageLinkClassName={'page-link'}
                    previousClassName={'page-item'}
                    previousLinkClassName={'page-link'}
                    nextClassName={'page-item'}
                    nextLinkClassName={'page-link'}
                    breakClassName={'page-item'}
                    breakLinkClassName={'page-link'}
                    activeClassName={'active'}
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

export default Entreprises;
