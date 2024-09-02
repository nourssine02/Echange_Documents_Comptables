import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./AddReglement.css";

const UpdateReglement = ({ isSidebarOpen }) => {
  const { id } = useParams();

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

  const initialPayementState = useMemo(
    () => ({
      modalite: "",
      num: "",
      banque: "",
      date_echeance: "",
      montant: "",
    }),
    []
  );

  const initialPieceState = useMemo(
    () => ({
      num_piece_a_regler: "",
      date_piece_a_regler: "",
      montant_piece_a_regler: "",
      montant_restant: "",
      document_fichier: "",
    }),
    []
  );

  const [reglement, setReglement] = useState(initialReglementState);
  const [payements, setPayements] = useState([initialPayementState]);
  const [pieces, setPieces] = useState([initialPieceState]);
  const [codeTiers, setCodeTiers] = useState([]);
  const [taux, setTaux] = useState([]);
  const [activeTab, setActiveTab] = useState("payements");
  const [options, setOptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [banques, setBanques] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/reglements_emis/${id}`
        );
        const { reglement, payements, pieces } = response.data;
        setReglement(reglement);
        setPayements(payements.length ? payements : [initialPayementState]);
        setPieces(pieces.length ? pieces : [initialPieceState]);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("An error occurred while fetching data. Please try again.");
      }
    };

    fetchData();
  }, [id, initialPayementState, initialPieceState]);

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
  }, []);

  useEffect(() => {
    const fetchTaux = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/taux_retenue_source/active"
        );
        console.log(res.data); // Ajoutez cette ligne pour déboguer
        setTaux(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchTaux();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "code_tiers") {
      const selectedCodeTier = codeTiers.find(
        (codeTier) => codeTier.code_tiers === value
      );
      if (selectedCodeTier) {
        setReglement((prev) => ({
          ...prev,
          code_tiers: selectedCodeTier.code_tiers,
          tiers_saisie: selectedCodeTier.identite,
        }));
      } else {
        setReglement((prev) => ({
          ...prev,
          code_tiers: "",
          tiers_saisie: "",
        }));
      }
    } else {
      setReglement({ ...reglement, [name]: value });
    }
  };

  const handleChangePayement = (e, index) => {
    const { name, value } = e.target;
    const updatedPayements = [...payements];
    updatedPayements[index][name] = value;
    setPayements(updatedPayements);
  };

  const handleChangePiece = (e, index) => {
    const { name, value, files } = e.target;
    if (name === "document_fichier") {
      handleFileChange(files, index);
    } else {
      const updatedPieces = [...pieces];
      updatedPieces[index][name] = value;
      setPieces(updatedPieces);
    }
  };

  const handleFileChange = (files, index) => {
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result.split(",")[1];
        const url = `data:${file.type};base64,${base64Data}`;
        const updatedPieces = [...pieces];
        updatedPieces[index].document_fichier = url;
        setPieces(updatedPieces);
      };
      reader.onerror = (err) => {
        console.error("Erreur lors de la lecture du fichier:", err);
      };
      reader.readAsDataURL(file);
    }
  };

  const addPayement = () => {
    setPayements([...payements, initialPayementState]);
  };

  const removePayement = async (index, payementId) => {
    try {
      await axios.delete(`http://localhost:5000/payements/${payementId}`);
      const updatedPayements = payements.filter((_, i) => i !== index);
      setPayements(updatedPayements);
    } catch (error) {
      console.error("Erreur lors de la suppression du payement :", error);
    }
  };

  const addPiece = () => {
    setPieces([...pieces, initialPieceState]);
  };

  const removePiece = async (index, pieceId) => {
    try {
      await axios.delete(`http://localhost:5000/pieces_a_regler/${pieceId}`);
      const updatedPieces = pieces.filter((_, i) => i !== index);
      setPieces(updatedPieces);
    } catch (error) {
      console.error("Erreur lors de la suppression du piece :", error);
    }
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
      alert("Règlement mis à jour avec succès.");
      navigate("/reglements_emis");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du règlement :", error);
      alert("Erreur lors de la mise à jour du règlement.");
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
              <div key={index}>
                <div className="row">
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Modalité :</label>
                      <select
                        style={{ color: "black" }}
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
                        <option value="Retrait de fonds">
                          Retrait de fonds
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Numéro :</label>
                      <input
                        type="text"
                        className="form-control"
                        name="num"
                        onChange={(e) => handleChangePayement(e, index)}
                        value={payement.num}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Banque :</label>
                      <select
                        style={{ color: "black" }}
                        value={payement.banque}
                        name="banque"
                        className="form-control mr-3"
                        onChange={(e) => handleChangePayement(e, index)}
                      >
                        <option value="">Sélectionnez une option</option>
                        {banques.map((banque) => (
                          <option key={banque.id} value={banque.name}>
                            {banque.name}
                          </option>
                        ))}{" "}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Date d'échéance :</label>
                      <input
                        type="date"
                        className="form-control"
                        name="date_echeance"
                        onChange={(e) => handleChangePayement(e, index)}
                        value={payement.date_echeance}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Montant :</label>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <input
                          type="text"
                          className="form-control"
                          name="montant"
                          onChange={(e) => handleChangePayement(e, index)}
                          value={payement.montant}
                        />
                        &nbsp;
                        <span>DT</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <button
                      type="button"
                      className="btn btn-danger btn-sm mt-5"
                      onClick={() => removePayement(index)}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
                <hr />
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
              <div key={index}>
                <div className="row">
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Numéro de pièce à régler :</label>
                      <Select
                        options={options}
                        onChange={(selectedOption) =>
                          handleSelectChange(selectedOption, index)
                        }
                        value={
                          options.find(
                            (option) =>
                              option.value === piece.num_piece_a_regler
                          ) || ""
                        }
                        isClearable
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Date de pièce à régler :</label>
                      <input
                        type="date"
                        className="form-control"
                        name="date_piece_a_regler"
                        onChange={(e) => handleChangePiece(e, index)}
                        value={piece.date_piece_a_regler || ""}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Montant de pièce à régler :</label>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <input
                          type="text"
                          className="form-control"
                          name="montant_piece_a_regler"
                          onChange={(e) => handleChangePiece(e, index)}
                          value={piece.montant_piece_a_regler || ""}
                        />
                        &nbsp;
                        <span>DT</span>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Montant restant de pièce</label>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <input
                          type="text"
                          className="form-control"
                          name="montant_restant"
                          onChange={(e) => handleChangePiece(e, index)}
                          value={piece.montant_restant || ""}
                        />
                        &nbsp;
                        <span>DT</span>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Document de pièce à régler :</label>

                      {piece.document_fichier && (
                        <img
                          src={piece.document_fichier}
                          alt="Document de pièce à régler"
                          style={{
                            width: "100px",
                            height: "auto",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            openImageViewer(piece.document_fichier)
                          }
                        />
                      )}
                    </div>
                  </div>

                  <div className="col-md-3">
                    <button
                      type="button"
                      className="btn btn-danger btn-sm mt-5"
                      onClick={() => removePiece(index)}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
                <hr />
              </div>
            ))}

            <button
              type="button"
              className="btn btn-success btn-sm mt-1"
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
                    {errors.base_retenue_source && (
                      <small className="text-danger">
                        {errors.base_retenue_source}
                      </small>
                    )}
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
                    {errors.taux_retenue_source && (
                      <small className="text-danger">
                        {errors.taux_retenue_source}
                      </small>
                    )}
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
                    {errors.montant_retenue_source && (
                      <small className="text-danger">
                        {errors.montant_retenue_source}
                      </small>
                    )}
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
                    {errors.montant_net && (
                      <small className="text-danger">
                        {errors.montant_net}
                      </small>
                    )}
                   
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
