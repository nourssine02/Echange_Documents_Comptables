import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

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
    prix: 0,
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
        console.error("Erreur lors de la récupération des détails de la facture :", error);
        alert("Une erreur s'est produite lors de la récupération des données. Veuillez réessayer.");
      }
    };
    fetchFactureDetails();
  }, [id]);

  const openDocumentInNewWindow = (facture) => {
    const newWindow = window.open("", "_blank");
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
            .print {
              margin-left: 500px;
            }
          </style>
        </head>
        <body>
          <img src="${facture.document_fichier}" alt="Document Image">
          <br><br>
          <div class="print">
            <button onclick="window.print()">Imprimer</button>
            <a href="${facture.document_fichier}" download="document_image.jpg">
              <button>Télécharger</button>
            </a>
          </div>
        </body>
        </html>
      `);
      newWindow.document.close();
    } else {
      alert("La nouvelle fenêtre n'a pas pu être ouverte. Veuillez vérifier vos paramètres de navigateur.");
    }
  };

  const handleCancel = () => {
    navigate("/facturations");
  };

  return (
    <div className="main-panel">
      <div className="content-wrapper">
      <div className="col-md-10 grid-margin grid-margin-md-0 stretch-card">
          <div className="card" style={{ marginLeft: "120px", marginTop: "-20px" }}>
            <div className="card-body" style={{ marginRight: "-150px", marginLeft: "2px" }}>
              <div className="row">
                <div className="col-md-12">
                  <h1 className="card-title">Détails de la Commande</h1>
                  <ul className="list-star" style={{ fontSize: "14px" }}>
                    <li><strong style={{ color: "darkblue", fontWeight: "bold" }} >Date de la Facture:</strong> {facture.date_facture}</li>
                    <li><strong style={{ color: "darkblue", fontWeight: "bold" }} >N° de la Facture:</strong> {facture.num_facture}</li>
                    <li><strong style={{ color: "darkblue", fontWeight: "bold" }} >Code Tiers:</strong> {facture.code_tiers}</li>
                    <li><strong style={{ color: "darkblue", fontWeight: "bold" }} >Tiers à Saisir:</strong> {facture.tiers_saisie}</li>
                    <li><strong style={{ color: "darkblue", fontWeight: "bold" }} >Référence de la Livraison:</strong> {facture.reference_livraison}</li>
                    <li><strong style={{ color: "darkblue", fontWeight: "bold" }}  >Montant HT de la Facture:</strong> {facture.montant_HT_facture}</li>
                    <li><strong style={{ color: "darkblue", fontWeight: "bold" }}  >FODEC sur la Facture:</strong> {facture.FODEC_sur_facture}</li>
                    <li><strong>TVA sur la Facture:</strong> {facture.TVA_facture}</li>
                    <li><strong>Timbre sur la Facture:</strong> {facture.timbre_facture}</li>
                    <li><strong>Autre montant de la Facture:</strong> {facture.autre_montant_facture}</li>
                    <li><strong>Montant Total de la Facture:</strong> {facture.montant_total_facture}</li>
                    <li><strong>Observations:</strong> {facture.observations}</li>
                    <li>
                      <strong>Document / Fichier à Insérer:</strong>{" "}
                      {facture.document_fichier ? (
                        <button className="btn btn-link" onClick={() => openDocumentInNewWindow(facture)}>Voir Document</button>
                      ) : (
                        <span>Pas de document inséré</span>
                      )}
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

                  <div className="btn-group" role="group" style={{ marginLeft: "150px" }}>
                    <Link to={`/updateFacture/${id}`} className="mr-2">
                      <button type="button" className="btn btn-success">
                        Modifier
                      </button>
                    </Link>
                    <button type="button" className="btn btn-warning mr-2" onClick={handleCancel}>
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
