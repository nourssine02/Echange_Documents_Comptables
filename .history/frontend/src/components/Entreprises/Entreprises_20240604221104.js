import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../Connexion/UserProvider";

const Entreprises = () => {
  const [entreprise, setEntreprise] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchEntreprise = async () => {
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
        setEntreprise(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchEntreprise();
  }, [user]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <div className="row" style={{marginTop: "-0px"}}>
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h2 className="font-medium text-center mb-5">
                  Liste des Entreprises
                </h2>
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
                {entreprise && entreprise.length > 0 ? (
                  <div className="table-responsive pt-3">
                    <table className="table table-sm table-hover">
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
                        {entreprise.map((ent) => (
                          <tr key={ent.id}>
                            <td>{ent.code_entreprise}</td>
                            <td>
                              {new Date(ent.date_creation).toLocaleDateString()}
                            </td>
                            <td>{ent.identite}</td>
                            <td>{ent.responsable}</td>
                            <td>{ent.adresse}</td>
                            <td>
                              <Link to={`/detailsEntreprise/${ent.id}`}>
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                >
                                  Détails
                                </button>
                              </Link>
                              &nbsp;
                              <Link to={`/updateEntreprise/${ent.id}`}>
                                <button
                                  type="button"
                                  className="btn btn-success"
                                >
                                  Modifier
                                </button>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center">
                    Aucune entreprise disponible pour cet utilisateur.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Entreprises;
