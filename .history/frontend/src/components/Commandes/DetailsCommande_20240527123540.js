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
        <div className="col-md-10 grid-margin grid-margin-md-0 stretch-card">
          <div className="card" style={{ marginLeft: "120px", marginTop: "-20px" }}>
            <div className="card-body" style={{ marginRight: "-150px", marginLeft: "2px" }}>
              <div className="row">
                <div className="col-md-12">
                  <h1 className="card-title">Détails de la Commande</h1>
                  <ul className="list-arrow" style={{ fontSize: "14px" }}>
                    <li><strong style={{ color: "darkgreen", fontWeight: "bold" }}>Date de Commande:</strong> {commande.date_commande}</li>
                    <li><strong style={{ color: "darkgreen", fontWeight: "bold" }}>N° de la Commande:</strong> {commande.num_commande}</li>
                    <li><strong style={{ color: "darkgreen", fontWeight: "bold" }}>Code Tiers:</strong> {commande.code_tiers}</li>
                    <li><strong style={{ color: "darkgreen", fontWeight: "bold" }}>Tiers à Saisir:</strong> {commande.tiers_saisie}</li>
                    <li><strong style={{ color: "darkgreen", fontWeight: "bold" }}>Montant de la Commande:</strong> {commande.montant_commande}</li>
                    <li><strong style={{ color: "darkgreen", fontWeight: "bold" }}>Date de Livraison Prévue:</strong> {commande.date_livraison_prevue}</li>
                    <li><strong style={{ color: "darkgreen", fontWeight: "bold" }}>Observations:</strong> {commande.observations}</li>
                    <li>
                      <strong style={{ color: "darkgreen", fontWeight: "bold" }}>Document / Fichier:</strong>
                      {commande.document_fichier ? (
                        <button className="btn btn-link" onClick={() => openDocumentInNewWindow(commande)}>
                          Voir Document
                        </button>
                      ) : (
                        <span>Pas de document inséré</span>
                      )}
                    </li>
                  </ul>
                  <h3 className="card-title">Familles:</h3>
                  <ul className="list-star" style={{ fontSize: "14px" }}>
                    {familles.map((famille, index) => (
                      <li key={index}>
                        <strong style={{ color: "darkgreen", fontWeight: "bold" }}>Famille:</strong> {famille.famille}, 
                        <strong style={{ color: "darkgreen", fontWeight: "bold" }}> Sous Famille:</strong> {famille.sous_famille}, 
                        <strong style={{ color: "darkgreen", fontWeight: "bold" }}> Article:</strong> {famille.article}, 
                        <strong style={{ color: "darkgreen", fontWeight: "bold" }}> Quantité:</strong> {famille.quantite}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="btn-group" role="group" style={{ marginLeft: "250px" }}>
                <Link to={`/updateCommande/${id}`} className="mr-2">
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
  );
};

export default DetailsCommande;
