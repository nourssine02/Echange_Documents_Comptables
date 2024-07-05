import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddReglement.css";

const AddReglement = ({ isSidebarOpen, user }) => {
  const initialReglementState = {
    date_saisie: new Date().toISOString().split("T")[0],
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

  const [inputValidity, setInputValidity] = useState({
    date_saisie: false,
    code_tiers: false,
    tiers_saisie: false,
    montant_brut: false,
    base_retenue_source: false,
    taux_retenue_source: false,
    montant_retenue_source: false,
    montant_net: false,
  });

  const [reglement, setReglement] = useState(initialReglementState);
  const [payements, setPayements] = useState([initialPayementState]);
  const [pieces, setPieces] = useState([initialPieceState]);
  const [codeTiers, setCodeTiers] = useState([]);
  const [taux, setTaux] = useState([]);
  const [activeTab, setActiveTab] = useState("payements");
  const [alert, setAlert] = useState(null); // State for alert messages
  const [errors, setErrors] = useState({}); // State for form errors

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCodeTiers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/code_tiers");
        setCodeTiers(res.data);
      } catch (err) {
        console.error("Erreur lors de la récupération des codes tiers :", err);
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
        setTaux(res.data);
      } catch (err) {
        console.error("Erreur lors de la récupération des taux :", err);
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
      validateField("code_tiers", value);
    } else {
      setReglement((prev) => ({ ...prev, [name]: value }));
      validateField(name, value);
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
      handleFileChange(files);
    } else {
      const updatedPieces = [...pieces];
      updatedPieces[index][name] = value;
      setPieces(updatedPieces);
    }
  };

  const handleFileChange = (files) => {
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result.split(",")[1];
        const url = `data:${file.type};base64,${base64Data}`;
        setPieces((prev) => ({ ...prev, document_fichier: url }));
      };
      reader.onerror = (err) => {
        console.error("Erreur lors de la lecture du fichier :", err);
      };
      reader.readAsDataURL(file);
    }
  };

  const addPayement = () => {
    setPayements([...payements, initialPayementState]);
  };

  const removePayement = (index) => {
    const updatedPayements = [...payements];
    updatedPayements.splice(index, 1);
    setPayements(updatedPayements);
  };

  const addPiece = () => {
    setPieces([...pieces, initialPieceState]);
  };

  const removePiece = (index) => {
    const updatedPieces = [...pieces];
    updatedPieces.splice(index, 1);
    setPieces(updatedPieces);
  };

  const validateField = (name, value) => {
    let error = "";
    let valid = false;

    switch (name) {
      case "code_tiers":
        error = value ? "" : "Le code tiers est obligatoire";
        valid = value !== "";
        break;
      case "tiers_saisie":
        error = value ? "" : "Le tiers saisi est obligatoire";
        valid = value !== "";
        break;
      case "montant_brut":
        error = value ? "" : "Le montant brut est obligatoire";
        valid = value !== "";
        break;
      case "base_retenue_source":
        error = value ? "" : "La base retenue à la source est obligatoire";
        valid = value !== "";
        break;
      case "taux_retenue_source":
        error = value ? "" : "Le taux retenue à la source est obligatoire";
        valid = value !== "";
        break;
      case "montant_retenue_source":
        error = value ? "" : "Le montant retenue à la source est obligatoire";
        valid = value !== "";
        break;
      case "montant_net":
        error = value ? "" : "Le montant net est obligatoire";
        valid = value !== "";
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    setInputValidity((prevValidity) => ({ ...prevValidity, [name]: valid }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    Object.keys(reglement).forEach((key) => validateField(key, reglement[key]));

    if (Object.values(inputValidity).every((valid) => valid)) {
      const data = { reglement, payements, pieces };
      try {
        const response = await axios.post(
          "http://localhost:5000/reglements_emis",
          data
        );
        console.log(response.data.message);
        setAlert({ type: "success", message: "Données ajoutées avec succès." });

        if (user.role === "comptable") {
          // Ajouter une notification
          const notificationMessage = `${user.identite} a ajouté un règlement`;
          const notificationData = {
            userId: user.id,
            message: notificationMessage,
          };

          await axios.post(
            "http://localhost:5000/notifications",
            notificationData
          );
        }

        setReglement(initialReglementState);
        setPayements([initialPayementState]);
        setPieces([initialPieceState]);

        setTimeout(() => {
          navigate("/reglements_emis");
        }, 2000);
      } catch (error) {
        console.error("Erreur lors de l'ajout du règlement :", error);
        setAlert({ type: "error", message: "Erreur lors de l'ajout du règlement." });
      }
    } else {
      setAlert({ type: "error", message: "Veuillez remplir tous les champs obligatoires." });
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
              <div>
                <div key={index} className="row">
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
                        <option value="Espèces">Espèces</option>
                        <option value="Virement">Virement</option>
                        <option value="Chèque">Chèque</option>
                        <option value="Traite">Traite</option>
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
                        value={payement.num}
                        onChange={(e) => handleChangePayement(e, index)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Banque :</label>
                      <input
                        type="text"
                        className="form-control"
                        name="banque"
                        value={payement.banque}
                        onChange={(e) => handleChangePayement(e, index)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Date d'échéance :</label>
                      <input
                        type="date"
                        className="form-control"
                        name="date_echeance"
                        value={payement.date_echeance}
                        onChange={(e) => handleChangePayement(e, index)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Montant :</label>
                      <input
                        type="number"
                        className="form-control"
                        name="montant"
                        value={payement.montant}
                        onChange={(e) => handleChangePayement(e, index)}
                      />
                    </div>
                  </div>
                  {payements.length > 1 && (
                    <div className="col-md-1">
                      <button
                        className="btn btn-danger"
                        onClick={() => removePayement(index)}
                      >
                        Supprimer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <button className="btn btn-success" onClick={addPayement}>
              Ajouter un paiement
            </button>
          </div>
        );

      case "pieces":
        return (
          <div>
            <h3>Pièces jointes</h3>
            {pieces.map((piece, index) => (
              <div key={index} className="row">
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Numéro de la pièce :</label>
                    <input
                      type="text"
                      className="form-control"
                      name="num_piece_a_regler"
                      value={piece.num_piece_a_regler}
                      onChange={(e) => handleChangePiece(e, index)}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Date de la pièce :</label>
                    <input
                      type="date"
                      className="form-control"
                      name="date_piece_a_regler"
                      value={piece.date_piece_a_regler}
                      onChange={(e) => handleChangePiece(e, index)}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Montant de la pièce :</label>
                    <input
                      type="number"
                      className="form-control"
                      name="montant_piece_a_regler"
                      value={piece.montant_piece_a_regler}
                      onChange={(e) => handleChangePiece(e, index)}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Document :</label>
                    <input
                      type="file"
                      className="form-control"
                      name="document_fichier"
                      onChange={(e) => handleChangePiece(e, index)}
                    />
                  </div>
                </div>
                {pieces.length > 1 && (
                  <div className="col-md-1">
                    <button
                      className="btn btn-danger"
                      onClick={() => removePiece(index)}
                    >
                      Supprimer
                    </button>
                  </div>
                )}
              </div>
            ))}
            <button className="btn btn-success" onClick={addPiece}>
              Ajouter une pièce jointe
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={isSidebarOpen ? "active" : ""}>
      <div className="container-fluid mt-4">
        <div className="card">
          <div className="card-header">
            <h3>Ajouter un règlement</h3>
          </div>
          <div className="card-body">
            {alert && (
              <div className={`alert alert-${alert.type}`} role="alert">
                {alert.message}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Date de saisie :</label>
                    <input
                      type="date"
                      className={`form-control ${
                        errors.date_saisie ? "is-invalid" : ""
                      }`}
                      name="date_saisie"
                      value={reglement.date_saisie}
                      onChange={handleChange}
                    />
                    {errors.date_saisie && (
                      <div className="invalid-feedback">
                        {errors.date_saisie}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Code tiers :</label>
                    <select
                      className={`form-control ${
                        errors.code_tiers ? "is-invalid" : ""
                      }`}
                      name="code_tiers"
                      value={reglement.code_tiers}
                      onChange={handleChange}
                    >
                      <option value="">Sélectionnez...</option>
                      {codeTiers.map((codeTier) => (
                        <option key={codeTier.code_tiers} value={codeTier.code_tiers}>
                          {codeTier.code_tiers}
                        </option>
                      ))}
                    </select>
                    {errors.code_tiers && (
                      <div className="invalid-feedback">{errors.code_tiers}</div>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Tiers saisi :</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.tiers_saisie ? "is-invalid" : ""
                      }`}
                      name="tiers_saisie"
                      value={reglement.tiers_saisie}
                      onChange={handleChange}
                    />
                    {errors.tiers_saisie && (
                      <div className="invalid-feedback">{errors.tiers_saisie}</div>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Montant brut :</label>
                    <input
                      type="number"
                      className={`form-control ${
                        errors.montant_brut ? "is-invalid" : ""
                      }`}
                      name="montant_brut"
                      value={reglement.montant_brut}
                      onChange={handleChange}
                    />
                    {errors.montant_brut && (
                      <div className="invalid-feedback">{errors.montant_brut}</div>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Base retenue à la source :</label>
                    <input
                      type="number"
                      className={`form-control ${
                        errors.base_retenue_source ? "is-invalid" : ""
                      }`}
                      name="base_retenue_source"
                      value={reglement.base_retenue_source}
                      onChange={handleChange}
                    />
                    {errors.base_retenue_source && (
                      <div className="invalid-feedback">
                        {errors.base_retenue_source}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Taux retenue à la source :</label>
                    <select
                      className={`form-control ${
                        errors.taux_retenue_source ? "is-invalid" : ""
                      }`}
                      name="taux_retenue_source"
                      value={reglement.taux_retenue_source}
                      onChange={handleChange}
                    >
                      <option value="">Sélectionnez...</option>
                      {taux.map((item) => (
                        <option key={item.taux} value={item.taux}>
                          {item.taux}
                        </option>
                      ))}
                    </select>
                    {errors.taux_retenue_source && (
                      <div className="invalid-feedback">
                        {errors.taux_retenue_source}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Montant retenue à la source :</label>
                    <input
                      type="number"
                      className={`form-control ${
                        errors.montant_retenue_source ? "is-invalid" : ""
                      }`}
                      name="montant_retenue_source"
                      value={reglement.montant_retenue_source}
                      onChange={handleChange}
                    />
                    {errors.montant_retenue_source && (
                      <div className="invalid-feedback">
                        {errors.montant_retenue_source}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Taux de TVA :</label>
                    <select
                      className={`form-control ${
                        errors.taux_tva ? "is-invalid" : ""
                      }`}
                      name="taux_tva"
                      value={reglement.taux_tva}
                      onChange={handleChange}
                    >
                      <option value="">Sélectionnez...</option>
                      {tauxTVA.map((item) => (
                        <option key={item.taux_tva} value={item.taux_tva}>
                          {item.taux_tva}
                        </option>
                      ))}
                    </select>
                    {errors.taux_tva && (
                      <div className="invalid-feedback">{errors.taux_tva}</div>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Montant de la TVA :</label>
                    <input
                      type="number"
                      className={`form-control ${
                        errors.montant_tva ? "is-invalid" : ""
                      }`}
                      name="montant_tva"
                      value={reglement.montant_tva}
                      onChange={handleChange}
                    />
                    {errors.montant_tva && (
                      <div className="invalid-feedback">{errors.montant_tva}</div>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Montant net à payer :</label>
                    <input
                      type="number"
                      className={`form-control ${
                        errors.montant_net_payer ? "is-invalid" : ""
                      }`}
                      name="montant_net_payer"
                      value={reglement.montant_net_payer}
                      onChange={handleChange}
                    />
                    {errors.montant_net_payer && (
                      <div className="invalid-feedback">
                        {errors.montant_net_payer}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Motif de règlement :</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.motif_reglement ? "is-invalid" : ""
                      }`}
                      name="motif_reglement"
                      value={reglement.motif_reglement}
                      onChange={handleChange}
                    />
                    {errors.motif_reglement && (
                      <div className="invalid-feedback">
                        {errors.motif_reglement}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group">
                    <label>Mode de paiement :</label>
                    <select
                      className={`form-control ${
                        errors.mode_paiement ? "is-invalid" : ""
                      }`}
                      name="mode_paiement"
                      value={reglement.mode_paiement}
                      onChange={handleChange}
                    >
                      <option value="">Sélectionnez...</option>
                      {modesPaiement.map((mode) => (
                        <option key={mode.mode_paiement} value={mode.mode_paiement}>
                          {mode.mode_paiement}
                        </option>
                      ))}
                    </select>
                    {errors.mode_paiement && (
                      <div className="invalid-feedback">{errors.mode_paiement}</div>
                    )}
                  </div>
                </div>
                {renderSubForm(reglement.mode_paiement)}
              </div>
              <div className="form-group mt-4">
                <button type="submit" className="btn btn-primary mr-2">
                  Enregistrer
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddReglement;
