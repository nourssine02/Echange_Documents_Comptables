import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const DetailsReglement = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Initialize state variables
  const [reglement, setReglement] = useState({
    date_saisie: "",
    code_tiers: "",
    tiers_saisie: "",
    montant_brut: "",
    base_retenue_source: "",
    taux_retenue_source: "",
    montant_retenue_source: "",
    montant_net: "",
    observations: "",
  });

  const [payements, setPayements] = useState([]);
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/reglements_emis/${id}`
        );
        const { data } = response;
        setReglement(data.reglement);
        setPayements(data.payements || []); // Ensure payements is an array
        setPieces(data.pieces || []); // Ensure pieces is an array
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleCancel = () => {
    navigate("/reglements_emis");
  };

  function openDocumentInNewWindow(piece) {
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
                <img src="${piece.document_fichier}" alt="Document Image">
                <br></br><br></br>
                <div class="print">
                <button onclick="window.print()" >Print</button>
                <a href="${piece.document_fichier}" download="document_image.jpg"><button>Download</button></a>
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

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <div className="col-md-9 grid-margin grid-margin-md-0 stretch-card">
          <div
            className="card"
            style={{ marginLeft: "150px", marginTop: "-20px" }}
          >
            <div
              className="card-body"
              style={{ marginRight: "-200px", marginLeft: "8px" }}
            >
              <div className="row">
                <div className="col-md-12">
                  <h1 className="card-title">Détails du Règlement Émis</h1>
                  <ul className="list-arrow" style={{ fontSize: "14px" }}>
                    {/* Display the details of reglement */}
                    <li>
                      <strong>Date de Saisie:</strong> {reglement.date_saisie}
                    </li>
                    <li>
                      <strong>Code Tiers:</strong> {reglement.code_tiers}
                    </li>
                    <li>
                      <strong>Tiers à Saisir:</strong> {reglement.tiers_saisie}
                    </li>
                    <li>
                      <strong>Montant Brut:</strong> {reglement.montant_brut}
                    </li>
                    <li>
                      <strong>Base de la retenue à la source:</strong>{" "}
                      {reglement.base_retenue_source}
                    </li>
                    <li>
                      <strong>Taux de la retenue à la source:</strong>{" "}
                      {reglement.taux_retenue_source}
                    </li>
                    <li>
                      <strong>Montant de la retenue à la source:</strong>{" "}
                      {reglement.montant_retenue_source}
                    </li>
                    <li>
                      <strong>Montant Net:</strong> {reglement.montant_net}
                    </li>
                    <li>
                      <strong>Observations:</strong> {reglement.observations}
                    </li>
                  </ul>
                </div>

                {/* Display the payements */}
                <div className="col-md-6">
                  <h3>Payements</h3>
                  <ul className="list-star" style={{ marginTop: "20px" }}>

                    {payements &&
                      payements.map((payement, index) => (
                        <li key={index}>
                          <strong>Modalité:</strong> {payement.modalite}
                          <br />
                          <strong>Num:</strong> {payement.num}
                          <br />
                          <strong>Banque:</strong> {payement.banque}
                          <br />
                          <strong>Date d'échéance:</strong>{" "}
                          {payement.date_echeance}
                          <br />
                          <strong>Montant :</strong> {payement.montant}
                          <br />
                          <br />
                        </li>
                      ))}

                  </ul>
                </div>

                {/* Display the pieces */}
                <div className="col-md-6" style={{ marginTop: "20px", marginLeft: "-130px" }}>
                  <h3>Pièces</h3>
                  <ul
                    className="list-ticked"
                  >
                    {pieces &&
                      pieces.map((piece, index) => (
                        <li key={index}>
                          <strong>N° de la Pièce à Régler:</strong>{" "}
                          {piece.num_piece_a_regler}
                          <br />
                          <strong>Date de la Pièce à Régler:</strong>{" "}
                          {piece.date_piece_a_regler}
                          <br />
                          <strong>Montant de la Pièce à Régler:</strong>{" "}
                          {piece.montant_piece_a_regler}
                          <br />
                          <strong>Document / Fichier:</strong>
                          {piece.document_fichier ? (
                            <button
                              className="btn btn-link"
                              onClick={() => openDocumentInNewWindow(piece)}
                            >
                              Voir Document
                            </button>
                          ) : (
                            <span>Pas de document inséré</span>
                          )}
                          <br />
                          <br />
                        </li>
                      ))}
                  </ul>
                </div>
              </div>

              {/* Buttons */}
              <div className="btn-group" role="group" style={{marginLeft: "200px"}}>
                <Link to={`/updateReglement/${id}`} className="mr-2">
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

export default DetailsReglement;
