import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Versements = ({isSidebarOpen}) => {
  const [versements, setVersements] = useState([]);

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
  }, []);

  const openImageViewer = (documentUrl) => {
    const imageWindow = window.open("", "_blank");
    const img = document.createElement("img");
    img.src = documentUrl;
    img.style.width = "40%";
    img.style.height = "100%";
    img.style.marginLeft = "350px";
    imageWindow.document.body.appendChild(img);
  };

  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? 'shifted' : ''}`}>
      <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h2 className="titre">Liste des Versements</h2>
                <br></br>
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
