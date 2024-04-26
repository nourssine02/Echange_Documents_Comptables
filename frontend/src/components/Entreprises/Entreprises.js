import axios from "axios";
import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

const Entreprises = () => {
  const [entreprises, setEntreprises] = useState([]);

  useEffect(() => {
    const fetchEntreprises = async () => {
      try {
        const res = await axios.get("http://localhost:5000/entreprises");
        setEntreprises(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchEntreprises();
  }, []);

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h2 className="titre">Liste des Entreprises</h2>
                <br></br>
                <p className="card-description">
                  <Link to="/addEntreprise">
                    <button type="button" className="btn btn-info">
                      Ajouter une Entreprise
                    </button>
                  </Link>
                </p>
                <div className="table-responsive pt-3">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Code Entreprise</th>
                        <th>Date de Creation</th>
                        <th>Identite</th>
                        <th>Responsable</th>
                        <th>Adresse</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {entreprises.map((entreprise) => (
                        <tr key={entreprise.id}>
                          <td>{entreprise.code_entreprise}</td>
                          <td>
                            {new Date(
                              entreprise.date_creation
                            ).toLocaleDateString()}
                          </td>
                          <td>{entreprise.identite}</td>
                          <td>{entreprise.responsable}</td>
                          <td>{entreprise.adresse}</td>
                          <td>
                          <Link to={`/detailsEntreprise/${entreprise.id}`}>
                              <button type="button" className="btn btn-primary">
                                Details
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default Entreprises;
