import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../Connexion/UserProvider";

const DetailsAchat = ({ isSidebarOpen }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [achat, setAchat] = useState({
    date_saisie: "",
    code_tiers: "",
    tiers_saisie: "",
    type_piece: "",
    num_piece: "",
    date_piece: "",
    statut: "",
    montant_HT_piece: "",
    FODEC_piece: "",
    TVA_piece: "",
    timbre_piece: "",
    autre_montant_piece: "",
    montant_total_piece: "",
    observations: "",
    document_fichier: "",  // Assuming Base64 blob string from backend
    mime_type: "",  // Optionally store the MIME type if available
  });

  const fetchAchatDetails = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/achats/${id}`);
      const data = response.data[0];
      setAchat(data);
    } catch (error) {
      console.error("Error fetching Achat details:", error);
    }
  };

  useEffect(() => {
    fetchAchatDetails(id);
  }, [id]);

  const handleCancel = () => {
    navigate("/achats");
  };

  const openDocumentInNewWindow = (achat) => {
    let imageUrl;
    if (achat.document_fichier) {
      // Default to image/jpeg if mime_type is not provided
      const mimeType = achat.mime_type || "image/jpeg";
      imageUrl = `data:${mimeType};base64,${achat.document_fichier}`;
    } else {
      console.error("Le document n'est pas disponible.");
      return;
    }
  
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
              display: block;
              margin: 0 auto;
              max-width: 90%;
              max-height: 90%;
            }
            .print {
              text-align: center;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <img src="${imageUrl}" alt="Document Image">
          <div class="print">
            <button onclick="window.print()">Print</button>
            <a href="${imageUrl}" download="document_image.${mimeType.split('/')[1]}"><button>Download</button></a>
          </div>
        </body>
        </html>
      `);
      newWindow.document.close();
    } else {
      alert("La nouvelle fenêtre n'a pas pu être ouverte. Veuillez vérifier les paramètres de votre navigateur.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/achats/${id}`);
      navigate("/achats");
    } catch (err) {
      console.log(err);
    }
  };

  const confirmDelete = (id) => {
    const confirmDelete = window.confirm(
      "Voulez-vous vraiment supprimer cette Achat  ?"
    );
    if (confirmDelete) {
      handleDelete(id);
    }
  };

  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? "shifted" : ""}`}>
        <div className="d-flex justify-content-center align-items-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h3 className="d-flex justify-content-center">
                  Détails de l'Achat
                </h3>
                <ul className="list-ticked" style={{ fontSize: "16px" }}>
                  <li>
                    <strong style={{ color: "#118ab2", fontWeight: "bold" }}>
                      Date de Saisie :
                    </strong>{" "}
                    {new Date(achat.date_saisie).toLocaleDateString()}
                  </li>
                  <li>
                    <strong style={{ color: "#118ab2", fontWeight: "bold" }}>
                      Code Tiers :
                    </strong>{" "}
                    {achat.code_tiers}
                  </li>
                  <li>
                    <strong style={{ color: "#118ab2", fontWeight: "bold" }}>
                      Tiers a Saisir:
                    </strong>{" "}
                    {achat.tiers_saisie}
                  </li>
                  <li>
                    <strong style={{ color: "#118ab2", fontWeight: "bold" }}>
                      Type de la Pièce:
                    </strong>{" "}
                    {achat.type_piece}
                  </li>
                  <li>
                    <strong style={{ color: "#118ab2", fontWeight: "bold" }}>
                      N° de la Pièce:
                    </strong>{" "}
                    {achat.num_piece}
                  </li>
                  <li>
                    <strong style={{ color: "#118ab2", fontWeight: "bold" }}>
                      Date de la Pièce:
                    </strong>
                    {new Date(achat.date_piece).toLocaleDateString()}
                  </li>
                  <li>
                    <strong style={{ color: "#118ab2", fontWeight: "bold" }}>
                      Statut:
                    </strong>{" "}
                    {achat.statut}
                  </li>
                  <li>
                    <strong style={{ color: "#118ab2", fontWeight: "bold" }}>
                      Montant HT de la Pièce:
                    </strong>{" "}
                    {achat.montant_HT_piece} DT
                  </li>
                  <li>
                    <strong style={{ color: "#118ab2", fontWeight: "bold" }}>
                      FODEC sur la Pièce:
                    </strong>{" "}
                    {achat.FODEC_piece} DT
                  </li>
                  <li>
                    <strong style={{ color: "#118ab2", fontWeight: "bold" }}>
                      TVA de la Pièce:
                    </strong>{" "}
                    {achat.TVA_piece} DT
                  </li>
                  <li>
                    <strong style={{ color: "#118ab2", fontWeight: "bold" }}>
                      Timbre sur la Pièce:
                    </strong>{" "}
                    {achat.timbre_piece} DT
                  </li>
                  <li>
                    <strong style={{ color: "#118ab2", fontWeight: "bold" }}>
                      Autre Montant sur la Pièce:
                    </strong>{" "}
                    {achat.autre_montant_piece} DT
                  </li>
                  <li>
                    <strong style={{ color: "#118ab2", fontWeight: "bold" }}>
                      Montant Total de la Pièce:
                    </strong>{" "}
                    {achat.montant_total_piece} DT
                  </li>
                  <li>
                    <strong style={{ color: "#118ab2", fontWeight: "bold" }}>
                      Observations:
                    </strong>{" "}
                    {achat.observations}
                  </li>{" "}
                  <li>
                    <strong style={{ color: "#118ab2", fontWeight: "bold" }}>
                      Document / Fichier à Insérer:
                    </strong>{" "}
                    <button
                      onClick={() => openDocumentInNewWindow(achat)}
                      className="btn btn-link"
                    >
                      Voir Document
                    </button>
                  </li>
                </ul>
                <div className="d-flex justify-content-center">
                {user.role !== "comptable" && (
                    <>
                      <Link to={`/updateAchat/${id}`} className="mr-2">
                        <button type="button" className="btn btn-success">
                          Modifier
                        </button>
                      </Link>
                      <button
                        type="button"
                        className="btn btn-danger mr-2"
                        onClick={() => confirmDelete(achat.id)}
                      >
                        Supprimer
                      </button>
                    </>
                  )}
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
  );
};

export default DetailsAchat;
