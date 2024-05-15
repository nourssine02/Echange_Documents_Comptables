import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import React, { useState, useEffect } from "react";

const DetailsFacture = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const initialFactureState = {
    date_facture: "",
    num_facture: "",
    code_tiers: "",
    tiers_saisie: "",
    reference_livraison: "",
    montant_HT_facture: "",
    FODEC_sur_facture: "",
    TVA_facture: "",
    timbre_facture: "",
    autre_montant_facture: "",
    montant_total_facture: "",
    observations: "",
    document_fichier: "",
  };

  const initialFamilleState = {
    famille: "",
    sous_famille: "",
    article: "",
    quantite: 0,
  };

  const [facture, setFacture] = useState(initialFactureState);
  const [familles, setFamilles] = useState([initialFamilleState]);

  useEffect(() => {
    const fetchFactureDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/facture/${id}`);
        const { data } = response;
        setFacture(data.facture);
        setFamilles(data.familles || []);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des détails de la facture :",
          error
        );
      }
    };
    fetchFactureDetails();
  }, [id]);

  function openDocumentInNewWindow(facture) {
    var newWindow = window.open("", "_blank");

    if (newWindow) {
      newWindow.document.write(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
                <style>  
                img {
                    margin-left: 400px;
                }
                .print{
                  margin-left: 500px;
                }
            </style>
            </head>
            <body>
                <img src="${facture.document_fichier}" alt="Document Image">
                <br></br><br></br>
                <div class="print">
                <button onclick="window.print()" >Print</button>
                <a href="${facture.document_fichier}" download="document_image.jpg"><button>Download</button></a>
                </div>
            </body>
            </html>
        `);
      newWindow.document.close();
    } else {
      alert(
        "The new window could not be opened. Please check your browser settings."
      );
    }
  }

  const handleCancel = () => {
    navigate("/facturations");
  };

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <div className="col-md-7 grid-margin grid-margin-md-0 stretch-card">
          <div className="card" style={{ marginLeft: "200px" }}>
            <div className="card-body">
              <div className="row">
                <div className="col-md-12">
                  <h1 className="card-title">Détails du Facture</h1>
                  <ul className="list-star" style={{ fontSize: "14px" }}>
                    <li>
                      <strong>Date de la Facture:</strong>{" "}
                      {facture.date_facture}
                    </li>
                    <li>
                      <strong>N° de la Facture:</strong> {facture.num_facture}
                    </li>
                    <li>
                      <strong>Code Tiers:</strong> {facture.code_tiers}
                    </li>
                    <li>
                      <strong>Tiers à Saisir:</strong> {facture.tiers_saisie}
                    </li>
                    <li>
                      <strong>Reference de la Livraison:</strong>{" "}
                      {facture.reference_livraison}
                    </li>
                    <li>
                      <strong>Montant HT de la Facture:</strong>{" "}
                      {facture.montant_HT_facture}
                    </li>
                    <li>
                      <strong>FODEC sur la Facture:</strong>{" "}
                      {facture.FODEC_sur_facture}
                    </li>
                    <li>
                      <strong>TVA sur la Facture:</strong> {facture.TVA_facture}
                    </li>
                    <li>
                      <strong>Timbre sur la Facture:</strong>{" "}
                      {facture.timbre_facture}
                    </li>
                    <li>
                      <strong>Autre montant de la Facture:</strong>{" "}
                      {facture.autre_montant_facture}
                    </li>
                    <li>
                      <strong> Montant Total de la Facture:</strong>{" "}
                      {facture.montant_total_facture}
                    </li>
                    <li>
                      <strong>Observations:</strong> {facture.observations}
                    </li>{" "}
                    <li>
                      <strong>Document / Fichier à Insérer:</strong>{" "}
                      <button
                        onClick={() => openDocumentInNewWindow(facture)}
                        className="btn btn-btn-outline-dribbble"
                      >
                        Voir Document
                      </button>
                    </li>
                  </ul>

 {/* Display the familles */}
 <div className="col-md-6">
                  <h3>Familles</h3>
                  <ul className="list-arrow" style={{ marginTop: "20px" }}>
                    {familles &&
                      familles.map((famille, index) => (
                        <li key={index}>
                          <strong>Famille:</strong> {famille.famille}
                          <br />
                          <strong>Sous Famille:</strong> {famille.sous_famille}
                          <br />
                          <strong>Article:</strong> {famille.article}
                          <br />
                          <strong>Quantité :</strong> {famille.quantite}
                          <br />
                          <br />
                        </li>
                      ))}
                  </ul>
                </div>
                {/* fin */}
                  <div
                    className="btn-group"
                    role="group"
                    style={{ marginLeft: "150px" }}
                  >
                    <Link to={`/updateFacture/${id}`} className="mr-2">
                      <button type="button" className="btn btn-success">
                        Modifier
                      </button>
                    </Link>
                    <button
                      type="button"
                      className="btn btn-warning mr-2"
                      onClick={handleCancel}
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsFacture;
