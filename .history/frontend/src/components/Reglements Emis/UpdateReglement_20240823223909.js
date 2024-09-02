import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import Swal from "sweetalert2";
import TiersSaisie from "../TiersSaisie";

const UpdateReglement = ({ isSidebarOpen }) => {
  const { id } = useParams();

  const initialReglementState = {
    date_saisie: new Date().toISOString().split("T")[0],
    tierId: "",
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
    montant_restant: "",
    document_fichier: "",
  };

  const [reglement, setReglement] = useState(initialReglementState);
  const [payements, setPayements] = useState([initialPayementState]);
  const [pieces, setPieces] = useState([initialPieceState]);
  const [codeTiers, setCodeTiers] = useState([]);
  const [taux, setTaux] = useState([]);
  const [banques, setBanques] = useState([]);
  const [activeTab, setActiveTab] = useState("pieces");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/reglements_emis/${id}`);
        const { reglement, payements, pieces } = response.data;
        setReglement(reglement);
        setPayements(payements.length ? payements : [initialPayementState]);
        setPieces(pieces.length ? pieces : [initialPieceState]);
      } catch (error) {
        console.error("Erreur lors de la récupération du règlement :", error);
        alert("Erreur lors de la récupération des données.");
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchCodeTiers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/code_tiers");
        setCodeTiers(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCodeTiers();

    const fetchTaux = async () => {
      try {
        const res = await axios.get("http://localhost:5000/taux_retenue_source/active");
        setTaux(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchTaux();
  }, []);

  const fetchBanques = async (tierId) => {
    try {
      const response = await axios.get(`http://localhost:5000/tiers/${tierId}/banques`);
      setBanques(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des banques:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReglement({ ...reglement, [name]: value });
  };

  const handleChangePayement = (e, index) => {
    const { name, value } = e.target;
    const updatedPayements = [...payements];
    updatedPayements[index][name] = value;
    setPayements(updatedPayements);
  };

  const handleChangePiece = (e, index) => {
    const { name, value, files } = e.target;
    const updatedPieces = [...pieces];

    if (name === "document_fichier") {
      // Handle file input
      updatedPieces[index][name] = files[0];
    } else {
      updatedPieces[index][name] = value;
    }

    setPieces(updatedPieces);
  };

  // Ajout et suppression de paiements et pièces
  const addPayement = () => setPayements([...payements, initialPayementState]);

  const removePayement = (index) => {
    const updatedPayements = payements.filter((_, i) => i !== index);
    setPayements(updatedPayements);
  };

  const addPiece = () => setPieces([...pieces, initialPieceState]);

  const removePiece = (index) => {
    const updatedPieces = pieces.filter((_, i) => i !== index);
    setPieces(updatedPieces);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedPayements = payements.map((payement) => ({
        ...payement,
        reglement_emis_id: id,
      }));
      const formattedPieces = pieces.map((piece) => ({
        ...piece,
        reglement_emis_id: id,
      }));

      await axios.put(`http://localhost:5000/reglements_emis/${id}`, {
        reglement,
        payements: formattedPayements,
        pieces: formattedPieces,
      });
      Swal.fire("Succès", "Règlement mis à jour avec succès", "success");
      navigate("/reglements_emis");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du règlement :", error);
      Swal.fire("Erreur", "Erreur lors de la mise à jour du règlement", "error");
    }
  };

  const handleCancel = () => {
    navigate("/reglements_emis");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "payements":
        return (
          <div>
            <h3>Paiements</h3>
            {payements.map((payement, index) => (
              <div key={index} className="row">
                {/* Code pour afficher les champs de paiement */}
                <div className="col-md-3">
                  <label>Modalité :</label>
                  <select
                    className="form-control"
                    name="modalite"
                    onChange={(e) => handleChangePayement(e, index)}
                    value={payement.modalite}
                  >
                    <option value="">Sélectionnez...</option>
                    <option value="Chèque">Chèque</option>
                    <option value="Effet">Effet</option>
                    <option value="CB">CB</option>
                    <option value="Virement">Virement</option>
                  </select>
                </div>
                {/* Autres champs de paiement */}
                {/* Ajoutez le bouton de suppression */}
                <div className="col-md-3">
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => removePayement(index)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-success btn-sm"
              onClick={addPayement}
            >
              Ajouter un paiement
            </button>
          </div>
        );
      case "pieces":
        return (
          <div>
            <h3>Pièces</h3>
            {pieces.map((piece, index) => (
              <div key={index} className="row">
                {/* Code pour afficher les champs de pièce */}
                <div className="col-md-3">
                  <label>Numéro de pièce :</label>
                  <input
                    type="text"
                    className="form-control"
                    name="num_piece_a_regler"
                    value={piece.num_piece_a_regler || ""}
                    onChange={(e) => handleChangePiece(e, index)}
                  />
                </div>
                {/* Autres champs de pièce */}
                <div className="col-md-3">
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => removePiece(index)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-success btn-sm"
              onClick={addPiece}
            >
              Ajouter une pièce
            </button>
          </div>
        );
      default:
        return null;
    }
  };


  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? "shifted" : ""}`}>
        <div className="card">
          <div className="card-body">
            <h2 className="text-center">Ajouter un règlement Émis</h2>
            <br />
            <form onSubmit={handleSubmit} className="forms-sample">
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Date de saisie :</label>
                    <input
                      type="date"
                      className="form-control"
                      name="date_saisie"
                      value={reglement.date_saisie}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Code tiers :</label>
                    <Select
                      options={codeTiers.map((tier) => ({
                        value: tier.id,
                        label: `${tier.code_tiers} - ${tier.identite}`,
                      }))}
                      onChange={(option) => {
                        setReglement((prevState) => ({
                          ...prevState,
                          tierId: option?.value || "", // Stocker l'ID du tiers dans tierId
                          code_tiers:
                            codeTiers.find((tier) => tier.id === option?.value)
                              ?.code_tiers || "", // Stocker le code du tiers dans code_tiers
                        }));
                        fetchBanques(option?.value || "");
                      }}
                      value={
                        codeTiers.find((tier) => tier.id === reglement.tierId)
                          ? {
                              value: reglement.tierId,
                              label: `${
                                codeTiers.find(
                                  (tier) => tier.id === reglement.tierId
                                ).code_tiers
                              } - ${
                                codeTiers.find(
                                  (tier) => tier.id === reglement.tierId
                                ).identite
                              }`,
                            }
                          : null
                      }
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Tiers à Saisir :</label>
                    <input
                      type="text"
                      className="form-control"
                      name="tiers_saisie"
                      value={reglement.tiers_saisie}
                      onChange={handleChange}
                      onClick={handleModalShow}
                      disabled={!!reglement.code_tiers} // Désactiver le champ si un code_tiers est sélectionné
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Montant brut :</label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="text"
                        className="form-control"
                        name="montant_brut"
                        value={reglement.montant_brut}
                        onChange={handleChange}
                      />
                      &nbsp;
                      <span>DT</span>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Base retenue source :</label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="text"
                        className="form-control"
                        name="base_retenue_source"
                        value={reglement.base_retenue_source}
                        onChange={handleChange}
                      />
                      &nbsp;
                      <span>DT</span>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Taux retenue source :</label>
                    <select
                      style={{ color: "black" }}
                      className="form-control"
                      name="taux_retenue_source"
                      onChange={handleChange}
                      value={reglement.taux_retenue_source}
                    >
                      <option value="" style={{ color: "black" }}>
                        Sélectionnez...
                      </option>
                      {taux.map((taux) => (
                        <option
                          key={taux.taux}
                          value={taux.taux}
                          style={{ color: "black" }}
                        >
                          {taux.taux}%
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Montant retenue source :</label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="text"
                        className="form-control"
                        name="montant_retenue_source"
                        value={reglement.montant_retenue_source}
                        onChange={handleChange}
                      />
                      &nbsp;
                      <span>DT</span>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Montant net :</label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="text"
                        className="form-control"
                        name="montant_net"
                        value={reglement.montant_net}
                        onChange={handleChange}
                      />
                      &nbsp;
                      <span>DT</span>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Observations :</label>
                    <textarea
                      className="form-control"
                      name="observations"
                      placeholder="Entrez vos observations ici..."
                      onChange={handleChange}
                      value={reglement.observations}
                    />
                  </div>
                </div>
              </div>
              <div className="tabs">
                <button
                  type="button"
                  className={`btn ${
                    activeTab === "pieces" ? "btn-dark" : "btn-light"
                  }`}
                  onClick={() => setActiveTab("pieces")}
                >
                  Pièces
                </button>
                <button
                  type="button"
                  className={`btn ${
                    activeTab === "payements" ? "btn-dark" : "btn-light"
                  }`}
                  onClick={() => setActiveTab("payements")}
                >
                  Paiements
                </button>
              </div>
              <div className="tab-content">{renderTabContent()}</div>
              <br />
              <div className="d-flex justify-content-center">
                <button type="submit" className="btn btn-primary mr-2">
                  Ajouter
                </button>
                &nbsp;&nbsp;
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={handleCancel}
                >
                  Annuler
                </button>
              </div>
            </form>
            <TiersSaisie showModal={showModal} setShowModal={setShowModal} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateReglement;
