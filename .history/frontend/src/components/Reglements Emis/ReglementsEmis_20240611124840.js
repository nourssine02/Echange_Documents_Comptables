import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ReglementsEmis = ({isSidebarOpen}) => {
  const [reglements, setReglements] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(5);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchReglements = async () => {
      try {
        const res = await axios.get("http://localhost:5000/reglements_emis");
        console.log(res.data);
        setReglements(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchReglements();
  }, []);

  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? 'shifted' : ''}`}>
      <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h2 className="titre">Liste des Règlements Émis</h2>
                <br></br>
                <p className="card-description">
                  <Link to="/addReglement">
                    <button type="button" className="btn btn-info">
                      Ajouter un Règlement Emis
                    </button>
                  </Link>
                </p>
                
                <div className="table-responsive pt-3">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Date de Saisie</th>
                        <th>Code Tiers</th>
                        <th>Tiers Saisie</th>
                        <th>Montant Brut</th>
                        <th>
                            Base de la <br></br> retenue à la source
                        </th>
                        <th>
                            Montant Net
                        </th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {reglements.map((reglement, index) => (
                        <tr key={index}>
                          <td>
                            {new Date(
                              reglement.date_saisie
                            ).toLocaleDateString()}
                          </td>
                          <td>{reglement.code_tiers}</td>
                          <td>{reglement.tiers_saisie}</td>
                          <td>{reglement.montant_brut}</td>                          
                          <td>{reglement.taux_retenue_source}</td>
                          
                          <td>{reglement.montant_net}</td>
                          <td>
                            <Link to={`/detailsReglement/${reglement.id}`}>
                              <button type="button" className="btn btn-primary">
                                Détails
                              </button>
                            </Link>
                            &nbsp; &nbsp;
                            <Link to={`/updateReglement/${reglement.id}`}>
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

export default ReglementsEmis;
