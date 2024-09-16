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
    document_fichier: "",
  });

  const fetchAchatDetails = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/achats/${id}`);
      const data = response.data[0];
      setAchat(data);
    } catch (error) {
      console.error("Error fetching Achat details:", error);
      console.log("Detailed error:", error.response ? error.response : error.message);
    }
  };

  useEffect(() => {
    fetchAchatDetails(id);
  }, [id]);

  const handleCancel = () => {
    navigate("/achats");
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete("http://localhost:5000/achats/" + id);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const confirmDelete = (id) => {
    const confirmDelete = window.confirm("Voulez-vous vraiment supprimer ce Tier ?");
    if (confirmDelete) {
      handleDelete(id);
    }
  };

  const isBase64 = (str) => {
    // Simple base64 check (assuming base64 without header and data URL)
    return /^[A-Za-z0-9+/=]+$/.test(str) && (str.length % 4 === 0);
  };

  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? "shifted" : ""}`}>
        <div className="d-flex justify-content-center align-items-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h3 className="title text-center">Détails de l'Achat</h3>
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
                    {achat.document_fichier ? (
                      isBase64(achat.document_fichier) ? (
                        <img
                          src={`data:image/jpeg;base64,${achat.document_fichier}`}
                          alt="Document"
                          style={{ maxWidth: "100%", maxHeight: "400px" }}
                        />
                      ) : (
                        <img
                          src={achat.document_fichier}
                          alt="Document"
                          style={{ maxWidth: "100%", maxHeight: "400px" }}
                        />
                      )
                    ) : (
                      "Aucun document disponible"
                    )}
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
