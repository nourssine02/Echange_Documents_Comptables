import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../Connexion/UserProvider";


const ReglementsRecus = ({isSidebarOpen}) => {
  
  const [reglements, setReglements] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(5);
  const { user } = useContext(UserContext);


  useEffect(() => {
    const fetchReglements = async () => {
      try {
        const res = await axios.get("http://localhost:5000/reglements_recus");
        console.log(res.data);
        setReglements(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchReglements();
  }, [user]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
  };

  const filtered = reglements.filter((reglement) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      reglement.code_tiers.toString().includes(searchTermLower) ||
      reglement.tiers_saisie.toLowerCase().includes(searchTermLower) ||
      reglement.montant_total_a_regler.toString().includes(searchTermLower)
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
                <h2 className="titre">Liste des Règlements Reçus</h2>
                <br></br>
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
                  {user.role === "client" && (
                    <Link to="/addFacture">
                      <button type="button" className="btn btn-dark">
                        Ajouter une Facture
                      </button>
                    </Link>
                  )}
                </div>
                <p className="card-description">
                  <Link to="/addReglementRecu">
                    <button type="button" className="btn btn-info">
                      Ajouter un Règlement Reçus
                    </button>
                  </Link>
                </p>
                <div className="table-responsive pt-3">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Code Tiers</th>
                        <th>Tiers Saisie</th>
                        <th>Montant Total à Régler</th>
                        <th>
                          N° de la <br></br> Facture à Régler
                        </th>
                        <th>
                          Date de la <br></br> Facture à Régler
                        </th>
                        <th>
                          Montant de la <br></br> Facture à Régler
                        </th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((reglement, index) => (
                        <tr key={index}>
                        
                          <td>{reglement.code_tiers}</td>
                          <td>{reglement.tiers_saisie}</td>
                          <td>{reglement.montant_total_a_regler}</td>
                          <td>{reglement.num_facture}</td>
                          <td>
                            {new Date(
                              reglement.date_facture
                            ).toLocaleDateString()}
                          </td>
                          <td>{reglement.montant_total_facture}</td>                          
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReglementsRecus
