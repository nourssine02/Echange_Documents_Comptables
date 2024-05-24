import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const DocumentComptabilite = () => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/documents_comptabilite"
        );
        setDocuments(res.data);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };
    fetchDocuments();
  }, []);


  const VoirDocument = (id) => {

    setShowModal(true);
    setModalImageUrl(imageUrl); 
  };
  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h2 className="titre">Liste des Documents Comptables</h2>
                <br></br>
                <p className="card-description">
                  <Link to="/addDocCompta">
                    <button type="button" className="btn btn-info">
                      Ajouter un Document
                    </button>
                  </Link>
                </p>
                <div className="table-responsive pt-3">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Nature</th>
                        <th>Désignation</th>
                        <th>Destinataire</th>
                        <th>Priorité</th>
                        <th>Observations</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documents.map((doc) => (
                        <tr key={doc.id}>
                          <td>{doc.date}</td>
                          <td>{doc.nature}</td>
                          <td>{doc.designation}</td>
                          <td>{doc.destinataire}</td>
                          <td>{doc.priorite}</td>
                          <td>{doc.observations}</td>
                          <td>
                            <Link to={`/editDocCompta/${doc.id}`}>
                              <button className="btn btn-success">
                                Modifier
                              </button>
                            </Link>
                            <button
                              className="btn btn-danger ml-2"
                              onClick={() => VoirDocument(doc.id)}
                            >
                              Voir Document
                            </button> 
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

export default DocumentComptabilite;
