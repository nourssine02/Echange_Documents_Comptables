import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const DocumentComptabilite = () => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    fetchDocuments();
  }, []);

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
                      Ajouter un Document <br></br>pour la Comptabilité
                    </button>
                  </Link>
                </p>
                <div className="table-responsive pt-3">
                  <table className="table table-sm">

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
