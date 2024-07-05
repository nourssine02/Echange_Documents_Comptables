import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";

const DetailsReglement = ({isSidebarOpen}) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const initialReglementState = {
    date_saisie: "",
    code_tiers: "",
    tiers_saisie: "",
    montant_brut: "",
    base_retenue_source: "",
    taux_retenue_source: "",
    montant_retenue_source: "",
    montant_net: "",
    observations: "",
  };

  const initialPayementState = {
    modalite: "",
    num: "",
    banque: "",
    date_echeance: "",
    montant: "",
  };

  const initialPieceState = {
    num_piece_a_regler: "",
    date_piece_a_regler: "",
    montant_piece_a_regler: "",
    document_fichier: "",
  };

  const [reglement, setReglement] = useState(initialReglementState);
  const [payements, setPayements] = useState([initialPayementState]);
  const [pieces, setPieces] = useState([initialPieceState]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/reglements_emis/${id}`);
        const { data } = response;
        setReglement(data.reglement);
        setPayements(data.payements || []);
        setPieces(data.pieces || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("An error occurred while fetching data. Please try again.");
      }
    };

    fetchData();
  }, [id]);

  const handleCancel = () => {
    navigate("/reglements_emis");
  };

  const openDocumentInNewWindow = (piece) => {
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
          <img src="${piece.document_fichier}" alt="Document Image">
          <br><br>
          <div class="print">
            <button onclick="window.print()">Print</button>
            <a href="${piece.document_fichier}" download="document_image.jpg">
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
      <div className={`content-wrapper ${isSidebarOpen ? 'shifted' : ''}`}>
      <div className="col-md-10 grid-margin grid-margin-md-0 stretch-card">
          <div className="card" style={{ marginLeft: "120px", marginTop: "-20px" }}>
            <div className="card-body" style={{ marginRight: "-150px", marginLeft: "2px" }}>
              <div className="row">
                <div className="col-md-12">
                  <h1 className="card-title">Détails du Règlement Émis</h1>
                  <ul className="list-arrow" style={{ fontSize: "15px" }}>
                    <li><strong style={{ color: "#118ab2", fontWeight: "bold" }}>Date de Saisie:</strong> {reglement.date_saisie}</li>
                    <li><strong style={{ color: "#118ab2", fontWeight: "bold" }}>Code Tiers:</strong> {reglement.code_tiers}</li>
                    <li><strong style={{ color: "#118ab2", fontWeight: "bold" }}>Tiers à Saisir:</strong> {reglement.tiers_saisie}</li>
                    <li><strong style={{ color: "#118ab2", fontWeight: "bold" }}>Montant Brut:</strong> {reglement.montant_brut}</li>
                    <li><strong style={{ color: "#118ab2", fontWeight: "bold" }}>Base de la retenue à la source:</strong> {reglement.base_retenue_source}</li>
                    <li><strong style={{ color: "#118ab2", fontWeight: "bold" }}>Taux de la retenue à la source:</strong> {reglement.taux_retenue_source}</li>
                    <li><strong style={{ color: "#118ab2", fontWeight: "bold" }}>Montant de la retenue à la source:</strong> {reglement.montant_retenue_source}</li>
                    <li><strong style={{ color: "#118ab2", fontWeight: "bold" }}>Montant Net:</strong> {reglement.montant_net}</li>
                    <li><strong style={{ color: "#118ab2", fontWeight: "bold" }}>Observations:</strong> {reglement.observations}</li>
                  </ul>
                  <h3 className="card-title">Payements</h3>
                  <ul className="list-star" style={{ fontSize: "15px" }}>
                    {payements.map((payement, index) => (
                      <li key={index}>
                        <strong style={{ color: "#118ab2", fontWeight: "bold" }}>Modalité:</strong> {payement.modalite}, 
                        <strong style={{ color: "#118ab2", fontWeight: "bold" }}> Num:</strong> {payement.num}, 
                        <strong style={{ color: "#118ab2", fontWeight: "bold" }}> Banque:</strong> {payement.banque}, <br></br>
                        <strong style={{ color: "#118ab2", fontWeight: "bold" }}> Date d'échéance:</strong> {payement.date_echeance},
                        <strong style={{ color: "#118ab2", fontWeight: "bold" }}> Montant:</strong> {payement.montant}
                      </li>
                    ))}
                  </ul>
                  <h3 className="card-title">Pièces</h3>
                  <ul className="list-ticked" style={{ fontSize: "15px" }}>
                    {pieces.map((piece, index) => (
                      <li key={index}>
                        <strong style={{ color: "#118ab2", fontWeight: "bold" }}>N° de la Pièce à Régler:</strong> {piece.num_piece_a_regler}, 
                        <strong style={{ color: "#118ab2", fontWeight: "bold" }}> Date de la Pièce à Régler:</strong> {piece.date_piece_a_regler}, 
                        <strong style={{ color: "#118ab2", fontWeight: "bold" }}> Montant de la Pièce à Régler:</strong> {piece.montant_piece_a_regler}, <br></br>
                        <strong style={{ color: "#118ab2", fontWeight: "bold" }}> Document / Fichier:</strong>
                        {piece.document_fichier ? (
                          <button className="btn btn-link" onClick={() => openDocumentInNewWindow(piece)}>
                            Voir Document
                          </button>
                        ) : (
                          <span>Pas de document inséré</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="btn-group" role="group" style={{ marginLeft: "250px" }}>
                <Link to={`/updateReglement/${id}`} className="mr-2">
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

export default DetailsReglement;
