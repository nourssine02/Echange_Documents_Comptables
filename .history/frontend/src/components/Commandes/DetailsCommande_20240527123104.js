import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";

const DetailsCommande = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const initialCommandeState = {
    date_commande: "",
    num_commande: "",
    code_tiers: "",
    tiers_saisie: "",
    montant_commande: "",
    date_livraison_prevue: "",
    observations: "",
    document_fichier: "",
  };

  const initialFamilleState = {
    famille: "",
    sous_famille: "",
    article: "",
    quantite: 0,
  };

  const [commande, setCommande] = useState(initialCommandeState);
  const [familles, setFamilles] = useState([initialFamilleState]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/commande/${id}`);
        const { data } = response;
        setCommande(data.commande);
        setFamilles(data.familles || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("An error occurred while fetching data. Please try again.");
      }
    };

    fetchData();
  }, [id]);

  const handleCancel = () => {
    navigate("/commandes");
  };

  const openDocumentInNewWindow = (commande) => {
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
            .print {
              margin-left: 500px;
            }
          </style>
        </head>
        <body>
          <img src="${commande.document_fichier}" alt="Document Image">
          <br><br>
          <div class="print">
            <button onclick="window.print()">Print</button>
            <a href="${commande.document_fichier}" download="document_image.jpg">
              <button>Download</button>
            </a>
          </div>
        </body>
        </html>
      `);
      newWindow.document.close();
    } else {
      alert("The new window could not be opened. Please check your browser settings.");
    }
  };

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <div className="col-md-9 grid-margin grid-margin-md-0 stretch-card">
          <div className="card" style={{ marginLeft: "150px", marginTop: "-20px" }}>
            <div className="card-body" style={{ marginRight: "-200px", marginLeft: "8px" }}>
              <div className="row">
                <div className="col-md-12">
                  <h1 className="card-title">Détails du Commande</h1>
                  <table className="table table-bordered">
                    <tbody>
                      <tr>
                        <th>Date de Commande</th>
                        <td>{commande.date_commande}</td>
                      </tr>
                      <tr>
                        <th>N° de la Commande</th>
                        <td>{commande.num_commande}</td>
                      </tr>
                      <tr>
                        <th>Code Tiers</th>
                        <td>{commande.code_tiers}</td>
                      </tr>
                      <tr>
                        <th>Tiers à Saisir</th>
                        <td>{commande.tiers_saisie}</td>
                      </tr>
                      <tr>
                        <th>Montant de la Commande</th>
                        <td>{commande.montant_commande}</td>
                      </tr>
                      <tr>
                        <th>Date de Livraison Prévue</th>
                        <td>{commande.date_livraison_prevue}</td>
                      </tr>
                      <tr>
                        <th>Observations</th>
                        <td>{commande.observations}</td>
                      </tr>
                      <tr>
                        <th>Document / Fichier</th>
                        <td>
                          {commande.document_fichier ? (
                            <button className="btn btn-link" onClick={() => openDocumentInNewWindow(commande)}>
                              Voir Document
                            </button>
                          ) : (
                            <span>Pas de document inséré</span>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="col-md-12">
                  <h3>Familles</h3>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Famille</th>
                        <th>Sous Famille</th>
                        <th>Article</th>
                        <th>Quantité</th>
                      </tr>
                    </thead>
                    <tbody>
                      {familles.map((famille, index) => (
                        <tr key={index}>
                          <td>{famille.famille}</td>
                          <td>{famille.sous_famille}</td>
                          <td>{famille.article}</td>
                          <td>{famille.quantite}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="btn-group mt-4" role="group">
                <Link to={`/updateCommande/${id}`} className="mr-2">
                  <button type="button" className="btn btn-success">
                    Modifier
                  </button>
                </Link>
                <button type="button" className="btn btn-warning" onClick={handleCancel}>
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsCommande;
