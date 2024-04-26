import React from "react";
//import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";


const DetailsCommande = () => {
    const { id } = useParams();
    const navigate = useNavigate();


    const handleCancel = () => {
        navigate("/commandes");
      };
    
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
                  <h1 className="card-title">Détails du Commande</h1>
                    {/* Display the details of reglement */}
                  {/* <ul className="list-ticked" style={{ fontSize: "14px" }}>
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
                  </ul> */}
                </div>

                {/* Display the payements */}
                {/* <div className="col-md-6">
                  <h3>Payements</h3>
                  <ul className="list-ticked" style={{ marginTop: "20px" }}>
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
                </div> */}

              </div>

              {/* Buttons */}
              <div className="btn-group" role="group" style={{marginLeft: "200px"}}>
                <Link to={`/updateCommande/${id}`} className="mr-2">
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
  )
}

export default DetailsCommande
