import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../Connexion/UserProvider";

const DetailsAchat = ({isSidebarOpen}) => {
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
    document_fichier: "",
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

  function openDocumentInNewWindow(achat) {
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
                <img src="${achat.document_fichier}" alt="Document Image">
                <br></br><br></br>
                <div class="print">
                <button onclick="window.print()" >Print</button>
                <a href="${achat.document_fichier}" download="document_image.jpg"><button>Download</button></a>
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

  const handleDelete = async (id) => {
    try {
      await axios.delete("http://localhost:5000/achats/" + id);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const confirmDelete = (id) => {
    const confirmDelete = window.confirm(
      "Voulez-vous vraiment supprimer ce Tier  ?"
    );
    if (confirmDelete) {
      handleDelete(id);
    }
  };

  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? 'shifted' : ''}`}>
      <div className="col-md-6 jus">
          <div
            className="card"
          >
            <div className="card-body">
              <h1 className="card-title">Détails de l'Achat</h1>
              <ul className="list-arrow" style={{ fontSize: "16px" }}>
                <li>
                  <strong style={{ color: "#118ab2", fontWeight: "bold" }}>
                    Date de Saisie :
                  </strong>{" "}
                  {achat.date_saisie}
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
                  <strong style={{ color: "#118ab2", fontWeight: "bold" }}>N° de la Pièce:</strong> {achat.num_piece}
                </li>
                <li>
                  <strong style={{ color: "#118ab2", fontWeight: "bold" }}>Date de la Pièce:</strong> {achat.date_piece}
                </li>
                <li>
                  <strong style={{ color: "#118ab2", fontWeight: "bold" }}>Statut:</strong> {achat.statut}
                </li>
                <li>
                  <strong style={{ color: "#118ab2", fontWeight: "bold" }} >Montant HT de la Pièce:</strong>{" "}
                  {achat.montant_HT_piece} DT
                </li>
                <li>
                  <strong style={{ color: "#118ab2", fontWeight: "bold" }} >FODEC sur la Pièce:</strong> {achat.FODEC_piece} DT
                </li>
                <li>
                  <strong style={{ color: "#118ab2", fontWeight: "bold" }} >TVA de la Pièce:</strong> {achat.TVA_piece} DT
                </li>
                <li>
                  <strong style={{ color: "#118ab2", fontWeight: "bold" }} >Timbre sur la Pièce:</strong> {achat.timbre_piece} DT
                </li>
                <li>
                  <strong style={{ color: "#118ab2", fontWeight: "bold" }} >Autre Montant sur la Pièce:</strong>{" "}
                  {achat.autre_montant_piece} DT
                </li>
                <li>
                  <strong style={{ color: "#118ab2", fontWeight: "bold" }} >Montant Total de la Pièce:</strong>{" "}
                  {achat.montant_total_piece} DT
                </li>
                <li>
                  <strong style={{ color: "#118ab2", fontWeight: "bold" }} >Observations:</strong> {achat.observations}
                </li>{" "}
                <li>
                  <strong style={{ color: "#118ab2", fontWeight: "bold" }} >Document / Fichier à Insérer:</strong>{" "}
                  <button
                    onClick={() => openDocumentInNewWindow(achat)}
                    className="btn btn-btn-outline-dribbble"
                  >
                    Voir Document
                  </button>
                </li>
              </ul>
              <div className="d-flex justify-content-center" >
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
  );
};

export default DetailsAchat;
