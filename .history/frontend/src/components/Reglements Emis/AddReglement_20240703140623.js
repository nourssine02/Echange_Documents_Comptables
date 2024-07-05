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

  const [reglement, setReglement] = useState(initialReglementState);
  const [payements, setPayements] = useState([initialPayementState]);
  const [pieces, setPieces] = useState([initialPieceState]);
  const [codeTiers, setCodeTiers] = useState([]);
  const [taux, setTaux] = useState([]);
  const [activeTab, setActiveTab] = useState("payements");
  const [alert, setAlert] = useState(null); // State for alert messages
  const [fieldErrors, setFieldErrors] = useState({
    code_tiers: false,
    tiers_saisie: false,
    montant_brut: false,
    base_retenue_source: false,
    taux_retenue_source: false,
    montant_retenue_source: false,
    montant_net: false,
    observations: false,
    modalite: false,
    num: false,
    banque: false,
    date_echeance: false,
    montant: false,
    num_piece_a_regler: false,
    date_piece_a_regler: false,
    montant_piece_a_regler: false,
    document_fichier: false,
  });

  const navigate = useNavigate();

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
        const res = await axios.get("http://localhost:5000/taux_retenue_source/active");
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
        console.error("Erreur lors de la lecture du fichier:", err);
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

  const validateFields = () => {
    const requiredFields = [
      "code_tiers",
      "tiers_saisie",
      "montant_brut",
      "base_retenue_source",
      "taux_retenue_source",
      "montant_retenue_source",
      "montant_net",
      "observations",
      "modalite",
      "num",
      "banque",
      "date_echeance",
      "montant",
      "num_piece_a_regler",
      "date_piece_a_regler",
      "montant_piece_a_regler",
      "document_fichier",
    ];

    let isValid = true;

    const updatedFieldErrors = { ...fieldErrors };

    requiredFields.forEach((field) => {
      if (!reglement[field] || reglement[field] === "") {
        updatedFieldErrors[field] = true;
        isValid = false;
      } else {
        updatedFieldErrors[field] = false;
      }
    });

    setFieldErrors(updatedFieldErrors);

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      setAlert({ type: "danger", message: "Veuillez remplir tous les champs obligatoires." });
      return;
    }

    const data = { reglement, payements, pieces };
    try {
      const response = await axios.post("http://localhost:5000/reglements_emis", data);
      console.log(response.data.message);
      setAlert({ type: "success", message: "Données ajoutées avec succès." });

      if (user.role === "comptable") {
        // Add notification
        const notificationMessage = `${user.identite} a ajouté un règlement`;
        const notificationData = {
          userId: user.id,
          message: notificationMessage,
        };

        await axios.post("http://localhost:5000/notifications", notificationData);
      }

      setReglement(initialReglementState);
      setPayements([initialPayementState]);
      setPieces([initialPieceState]);

      setTimeout(() => {
        navigate("/reglements_emis");
      }, 2000);
    } catch (error) {
      console.error("Erreur lors de l'ajout du règlement :", error);
      setAlert({ type: "danger", message: "Erreur lors de l'ajout du règlement." });
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
                    <div className={`form-group ${fieldErrors.modalite ? 'has-error' : ''}`}>
                      <label>Modalité :</label>
                      <select
                        style={{ color: "black" }}
                        className={`form-control ${fieldErrors.modalite ? 'is-invalid' : 'is-valid'}`}
                        name="modalite"
                        onChange={(e) => handleChangePayement(e, index)}
                        value={payement.modalite}
                      >
                        <option value="">Sélectionnez...</option>
                        <option value="Espèces">Espèces</option>
                        <option value="Chèque">Chèque</option>
                        <option value="Traite">Traite</option>
                        <option value="Virement">Virement</option>
                      </select>
                      {fieldErrors.modalite && (
                        <div className="invalid-feedback">Ce champ est obligatoire.</div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className={`form-group ${fieldErrors.num ? 'has-error' : ''}`}>
                      <label>Numéro :</label>
                      <input
                        type="text"
                        className={`form-control ${fieldErrors.num ? 'is-invalid' : 'is-valid'}`}
                        name="num"
                        onChange={(e) => handleChangePayement(e, index)}
                        value={payement.num}
                      />
                      {fieldErrors.num && (
                        <div className="invalid-feedback">Ce champ est obligatoire.</div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className={`form-group ${fieldErrors.banque ? 'has-error' : ''}`}>
                      <label>Banque :</label>
                      <input
                        type="text"
                        className={`form-control ${fieldErrors.banque ? 'is-invalid' : 'is-valid'}`}
                        name="banque"
                        onChange={(e) => handleChangePayement(e, index)}
                        value={payement.banque}
                      />
                      {fieldErrors.banque && (
                        <div className="invalid-feedback">Ce champ est obligatoire.</div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className={`form-group ${fieldErrors.date_echeance ? 'has-error' : ''}`}>
                      <label>Date échéance :</label>
                      <input
                        type="date"
                        className={`form-control ${fieldErrors.date_echeance ? 'is-invalid' : 'is-valid'}`}
                        name="date_echeance"
                        onChange={(e) => handleChangePayement(e, index)}
                        value={payement.date_echeance}
                      />
                      {fieldErrors.date_echeance && (
                        <div className="invalid-feedback">Ce champ est obligatoire.</div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className={`form-group ${fieldErrors.montant ? 'has-error' : ''}`}>
                      <label>Montant :</label>
                      <input
                        type="number"
                        className={`form-control ${fieldErrors.montant ? 'is-invalid' : 'is-valid'}`}
                        name="montant"
                        onChange={(e) => handleChangePayement(e, index)}
                        value={payement.montant}
                      />
                      {fieldErrors.montant && (
                        <div className="invalid-feedback">Ce champ est obligatoire.</div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-3">
                    <button
                      className="btn btn-danger mt-4"
                      type="button"
                      onClick={() => removePayement(index)}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
                <hr />
              </div>
            ))}
            <button className="btn btn-primary" type="button" onClick={addPayement}>
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
                    <div className={`form-group ${fieldErrors.num_piece_a_regler ? 'has-error' : ''}`}>
                      <label>Numéro de la pièce :</label>
                      <input
                        type="text"
                        className={`form-control ${fieldErrors.num_piece_a_regler ? 'is-invalid' : 'is-valid'}`}
                        name="num_piece_a_regler"
                        onChange={(e) => handleChangePiece(e, index)}
                        value={piece.num_piece_a_regler}
                      />
                      {fieldErrors.num_piece_a_regler && (
                        <div className="invalid-feedback">Ce champ est obligatoire.</div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className={`form-group ${fieldErrors.date_piece_a_regler ? 'has-error' : ''}`}>
                      <label>Date de la pièce :</label>
                      <input
                        type="date"
                        className={`form-control ${fieldErrors.date_piece_a_regler ? 'is-invalid' : 'is-valid'}`}
                        name="date_piece_a_regler"
                        onChange={(e) => handleChangePiece(e, index)}
                        value={piece.date_piece_a_regler}
                      />
                      {fieldErrors.date_piece_a_regler && (
                        <div className="invalid-feedback">Ce champ est obligatoire.</div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className={`form-group ${fieldErrors.montant_piece_a_regler ? 'has-error' : ''}`}>
                      <label>Montant de la pièce :</label>
                      <input
                        type="number"
                        className={`form-control ${fieldErrors.montant_piece_a_regler ? 'is-invalid' : 'is-valid'}`}
                        name="montant_piece_a_regler"
                        onChange={(e) => handleChangePiece(e, index)}
                        value={piece.montant_piece_a_regler}
                      />
                      {fieldErrors.montant_piece_a_regler && (
                        <div className="invalid-feedback">Ce champ est obligatoire.</div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className={`form-group ${fieldErrors.document_fichier ? 'has-error' : ''}`}>
                      <label>Document (fichier) :</label>
                      <input
                        type="file"
                        className={`form-control ${fieldErrors.document_fichier ? 'is-invalid' : 'is-valid'}`}
                        name="document_fichier"
                        onChange={(e) => handleChangePiece(e, index)}
                      />
                      {fieldErrors.document_fichier && (
                        <div className="invalid-feedback">Ce champ est obligatoire.</div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-3">
                    <button
                      className="btn btn-danger mt-4"
                      type="button"
                      onClick={() => removePiece(index)}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
                <hr />
              </div>
            ))}
            <button className="btn btn-primary" type="button" onClick={addPiece}>
              Ajouter une pièce
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`add-reglement ${isSidebarOpen ? "sidebar-open" : ""}`}>
      <h2>Ajouter un Règlement</h2>
      {alert && (
        <div className={`alert alert-${alert.type}`}>
          {alert.message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className={`form-group ${fieldErrors.date_saisie ? 'has-error' : ''}`}>
          <label>Date de saisie :</label>
          <input
            type="date"
            className={`form-control ${fieldErrors.date_saisie ? 'is-invalid' : 'is-valid'}`}
            name="date_saisie"
            value={reglement.date_saisie}
            onChange={handleChange}
          />
          {fieldErrors.date_saisie && (
            <div className="invalid-feedback">Ce champ est obligatoire.</div>
          )}
        </div>
        <div className={`form-group ${fieldErrors.code_tiers ? 'has-error' : ''}`}>
          <label>Code tiers :</label>
          <select
            style={{ color: "black" }}
            className={`form-control ${fieldErrors.code_tiers ? 'is-invalid' : 'is-valid'}`}
            name="code_tiers"
            onChange={handleChange}
            value={reglement.code_tiers}
          >
            <option value="">Sélectionnez un code tiers</option>
            {codeTiers.map((tier) => (
              <option key={tier.code_tiers} value={tier.code_tiers}>
                {tier.code_tiers} - {tier.identite}
              </option>
            ))}
          </select>
          {fieldErrors.code_tiers && (
            <div className="invalid-feedback">Ce champ est obligatoire.</div>
          )}
        </div>
        <div className={`form-group ${fieldErrors.tiers_saisie ? 'has-error' : ''}`}>
          <label>Tiers saisi :</label>
          <input
            type="text"
            className={`form-control ${fieldErrors.tiers_saisie ? 'is-invalid' : 'is-valid'}`}
            name="tiers_saisie"
            value={reglement.tiers_saisie}
            onChange={handleChange}
            readOnly
          />
          {fieldErrors.tiers_saisie && (
            <div className="invalid-feedback">Ce champ est obligatoire.</div>
          )}
        </div>
        <div className={`form-group ${fieldErrors.montant_brut ? 'has-error' : ''}`}>
          <label>Montant brut :</label>
          <input
            type="number"
            className={`form-control ${fieldErrors.montant_brut ? 'is-invalid' : 'is-valid'}`}
            name="montant_brut"
            value={reglement.montant_brut}
            onChange={handleChange}
          />
          {fieldErrors.montant_brut && (
            <div className="invalid-feedback">Ce champ est obligatoire.</div>
          )}
        </div>
        <div className={`form-group ${fieldErrors.base_retenue_source ? 'has-error' : ''}`}>
          <label>Base retenue source :</label>
          <input
            type="number"
            className={`form-control ${fieldErrors.base_retenue_source ? 'is-invalid' : 'is-valid'}`}
            name="base_retenue_source"
            value={reglement.base_retenue_source}
            onChange={handleChange}
          />
          {fieldErrors.base_retenue_source && (
            <div className="invalid-feedback">Ce champ est obligatoire.</div>
          )}
        </div>
        <div className={`form-group ${fieldErrors.taux_retenue_source ? 'has-error' : ''}`}>
          <label>Taux retenue source :</label>
          <select
            style={{ color: "black" }}
            className={`form-control ${fieldErrors.taux_retenue_source ? 'is-invalid' : 'is-valid'}`}
            name="taux_retenue_source"
            onChange={handleChange}
            value={reglement.taux_retenue_source}
          >
            <option value="">Sélectionnez un taux</option>
            {taux.map((tx) => (
              <option key={tx.id} value={tx.valeur}>
                {tx.valeur}
              </option>
            ))}
          </select>
          {fieldErrors.taux_retenue_source && (
            <div className="invalid-feedback">Ce champ est obligatoire.</div>
          )}
        </div>
        <div className={`form-group ${fieldErrors.montant_retenue_source ? 'has-error' : ''}`}>
          <label>Montant retenue source :</label>
          <input
            type="number"
            className={`form-control ${fieldErrors.montant_retenue_source ? 'is-invalid' : 'is-valid'}`}
            name="montant_retenue_source"
            value={reglement.montant_retenue_source}
            onChange={handleChange}
          />
          {fieldErrors.montant_retenue_source && (
            <div className="invalid-feedback">Ce champ est obligatoire.</div>
          )}
        </div>
        <div className={`form-group ${fieldErrors.montant_net ? 'has-error' : ''}`}>
          <label>Montant net :</label>
          <input
            type="number"
            className={`form-control ${fieldErrors.montant_net ? 'is-invalid' : 'is-valid'}`}
            name="montant_net"
            value={reglement.montant_net}
            onChange={handleChange}
          />
          {fieldErrors.montant_net && (
            <div className="invalid-feedback">Ce champ est obligatoire.</div>
          )}
        </div>
        <div className={`form-group ${fieldErrors.observations ? 'has-error' : ''}`}>
          <label>Observations :</label>
          <textarea
            className={`form-control ${fieldErrors.observations ? 'is-invalid' : 'is-valid'}`}
            name="observations"
            value={reglement.observations}
            onChange={handleChange}
          ></textarea>
          {fieldErrors.observations && (
            <div className="invalid-feedback">Ce champ est obligatoire.</div>
          )}
        </div>
        {renderTabContent()}
        <div className="mt-4">
          <button type="submit" className="btn btn-primary mr-2">
            Enregistrer
          </button>
          <button type="button" className="btn btn-danger" onClick={handleCancel}>
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddReglement;
