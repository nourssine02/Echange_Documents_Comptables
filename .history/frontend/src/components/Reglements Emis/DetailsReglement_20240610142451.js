import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import "./DetailsReglement.css"; // Import the CSS file

const DetailsReglement = ({ isSidebarOpen }) => {
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
              margin-left: auto;
              margin-right: auto;
              display: block;
            }
            .print {
              text-align: center;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <img src="${piece.document_fichier}" alt="Document Image">
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
        <div className="card-container">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title">Détails du Règlement Émis</h1>
              <ul className="list-arrow">
                <li><strong>Date de Saisie:</strong> {reglement.date_saisie}</li>
                <li><strong>Code Tiers:</strong> {reglement.code_tiers}</li>
                <li><strong>Tiers à Saisir:</strong> {reglement.tiers_saisie}</li>
                <li><strong>Montant Brut:</strong> {reglement.montant_brut}</li>
                <li><strong>Base de la retenue à la source:</strong> {reglement.base_retenue_source}</li>
                <li><strong>Taux de la retenue à la source:</strong> {reglement.taux_retenue_source}</li>
                <li><strong>Montant de la retenue à la source:</strong> {reglement.montant_retenue_source}</li>
                <li><strong>Montant Net:</strong> {reglement.montant_net}</li>
                <li><strong>Observations:</strong> {reglement.observations}</li>
              </ul>
              <h3 className="card-title">Payements</h3>
              <ul className="list-star">
                {payements.map((payement, index) => (
                  <li key={index}>
                    <strong>Modalité:</strong> {payement.modalite},
                    <strong> Num:</strong> {payement.num},
                    <strong> Banque:</strong> {payement.banque}, <br />
                    <strong> Date d'échéance:</strong> {payement.date_echeance},
                    <strong> Montant:</strong> {payement.montant}
                  </li>
                ))}
              </ul>
              <h3 className="card-title">Pièces</h3>
              <ul className="list-ticked">
                {pieces.map((piece, index) => (
                  <li key={index}>
                    <strong>N° de la Pièce à Régler:</strong> {piece.num_piece_a_regler},
                    <strong> Date de la Pièce à Régler:</strong> {piece.date_piece_a_regler},
                    <strong> Montant de la Pièce à Régler:</strong> {piece.montant_piece_a_regler}, <br />
                    <strong> Document / Fichier:</strong>
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
              <div className="btn-group">
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
