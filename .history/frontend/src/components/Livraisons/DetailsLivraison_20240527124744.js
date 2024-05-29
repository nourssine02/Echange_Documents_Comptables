import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import React, { useState, useEffect } from "react";

const DetailsLivraison = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [livraison, setLivraison] = useState({
    date_BL: "",
    num_BL: "",
    code_tiers: "",
    tiers_saisie: "",
    reference_commande: "",
    montant_HT_BL: "",
    TVA_BL: "",
    montant_total_BL: "",
    observations: "",
    document_fichier: "",
  });

  useEffect(() => {
    axios
      .get(`http://localhost:5000/livraison/${id}`)
      .then((res) => {
        const data = res.data[0];
        setLivraison({
          date_BL: data.date_BL,
          num_BL: data.num_BL,
          code_tiers: data.code_tiers,
          tiers_saisie: data.tiers_saisie,
          reference_commande: data.reference_commande,
          montant_HT_BL: data.montant_HT_BL,
          TVA_BL: data.TVA_BL,
          montant_total_BL: data.montant_total_BL,
          observations: data.observations,
          document_fichier: data.document_fichier,
        });
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleCancel = () => {
    navigate("/livraisons");
  };

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <div className="col-md-7 grid-margin grid-margin-md-0 stretch-card">
          <div
            className="card"
            style={{ marginLeft: "200px", marginTop: "-27px" }}
          >
            <div className="card-body">
              <h1 className="card-title">Détails de la Livraison</h1>
              <ul className="list-arrow" style={{ fontSize: "14px" }}>
                <li>
                  <strong style={{ color: "darkgreen", fontWeight: "bold" }} >Date du Bon de Livraison:</strong> {livraison.date_BL}
                </li>
                <li>
                  <strong style={{ color: "darkgreen", fontWeight: "bold" }}>N° du Bon de Livraison:</strong> {livraison.num_BL}
                </li>
                <li>
                  <strong style={{ color: "darkgreen", fontWeight: "bold" }} >Code Tiers:</strong> {livraison.code_tiers}
                </li>
                <li>
                  <strong style={{ color: "darkgreen", fontWeight: "bold" }} >Tiers à Saisir:</strong> {livraison.tiers_saisie}
                </li>
                <li>
                  <strong style={{ color: "darkgreen", fontWeight: "bold" }} >Référence Commande:</strong>{" "}
                  {livraison.reference_commande}
                </li>
                <li>
                  <strong style={{ color: "darkgreen", fontWeight: "bold" }} >Montant HT du Bon de Livraison:</strong>{" "}
                  {livraison.montant_HT_BL}
                </li>
                <li>
                  <strong style={{ color: "darkgreen", fontWeight: "bold" }} >TVA du Bon de Livraison:</strong> {livraison.TVA_BL}
                </li>
                <li>
                  <strong style={{ color: "darkgreen", fontWeight: "bold" }} >Montant Total du Bon de Livraison:</strong>{" "}
                  {livraison.montant_total_BL}
                </li>
                <li>
                  <strong style={{ color: "darkgreen", fontWeight: "bold" }} >Observations:</strong> {livraison.observations}
                </li>{" "}
                <li>
                  <strong>Document / Fichier à Insérer:</strong>{" "}
                  <button
                    onClick={() => openDocumentInNewWindow(livraison)}
                    className="btn btn-btn-outline-dribbble"
                  >
                    Voir Document
                  </button>
                </li>

              </ul>
              <div className="btn-group" role="group">
                <Link to={`/updateLivraison/${id}`} className="mr-2">
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
  );
};

export default DetailsLivraison;


function openDocumentInNewWindow(livraison) {
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
                <img src="${livraison.document_fichier}" alt="Document Image">
                <br></br><br></br>
                <div class="print">
                <button onclick="window.print()" >Print</button>
                <a href="${livraison.document_fichier}" download="document_image.jpg"><button>Download</button></a>
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