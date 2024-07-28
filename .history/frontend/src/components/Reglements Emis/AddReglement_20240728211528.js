import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
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
  const [options, setOptions] = useState([]);

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
        const res = await axios.get(
          "http://localhost:5000/taux_retenue_source/active"
        );
        setTaux(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchTaux();
  }, []);


  useEffect(() => {
    const fetchPieces = async () => {
      try {
        const token = localStorage.getItem('token'); // Assurez-vous que le jeton est stocké ici
        const response = await axios.get("http://localhost:5000/pieces", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Transform the response data to match the Select component format
        const piecesOptions = response.data.map((piece) => ({
          value: piece.num_piece,
          label: piece.num_piece,
        }));
        setOptions(piecesOptions);
      } catch (error) {
        console.error("Error fetching pieces:", error);
      }
    };

    fetchPieces();
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
        setAlert({
          type: "success",
          message: "Reglement Emis ajoutées avec succès.",
        });

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
        setAlert({
          type: "danger",
          message: "Erreur lors de l'ajout du règlement.",
        });
      }
    } else {
      setAlert({
        type: "danger",
        message: "Veuillez remplir tous les champs obligatoires.",
      });
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
                        <option value="Chèque">Chèque</option>
                        <option value="Traite">Traite</option>
                        <option value="Virement">Virement</option>
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
                        <option value="Banques locales">Banques locales</option>
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
                      <input
                        type="text"
                        className="form-control"
                        name="montant"
                        onChange={(e) => handleChangePayement(e, index)}
                        value={payement.montant}
                      />
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
                        onChange={(selectedOption) => {
                          const value = selectedOption
                            ? selectedOption.value
                            : "";
                          handleChangePiece(
                            { target: { name: "num_piece_a_regler", value } },
                            index
                          );
                        }}
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
                        value={piece.date_piece_a_regler}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Montant de pièce à régler :</label>
                      <input
                        type="text"
                        className="form-control"
                        name="montant_piece_a_regler"
                        onChange={(e) => handleChangePiece(e, index)}
                        value={piece.montant_piece_a_regler}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Document fichier :</label>
                      <input
                        type="file"
                        className="form-control"
                        name="document_fichier"
                        onChange={(e) => handleChangePiece(e, index)}
                      />
                    </div>
                  </div>
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
            {alert && (
              <div
                className={`alert alert-${alert.type} d-flex align-items-center`}
                role="alert"
              >
                <div>{alert.message}</div>
              </div>
            )}
            <form onSubmit={handleSubmit} className="forms-sample">
              <div className="row">
                <div className="col-md-4">
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
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Code tiers :</label>
                    <select
                      style={{ color: "black" }}
                      className={`form-control ${
                        errors.code_tiers ? "is-invalid" : ""
                      }`}
                      name="code_tiers"
                      onChange={handleChange}
                      value={reglement.code_tiers}
                    >
                      <option value="" style={{ color: "black" }}>
                        Code Tiers
                      </option>
                      {codeTiers.map((codeTier) => (
                        <option
                          key={codeTier.code_tiers}
                          value={codeTier.code_tiers}
                          style={{ color: "black" }}
                        >
                          {codeTier.code_tiers}
                        </option>
                      ))}
                    </select>
                    {errors.code_tiers && (
                      <div className="invalid-feedback">
                        {errors.code_tiers}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Tiers à Saisir :</label>
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
                      <div className="invalid-feedback">
                        {errors.tiers_saisie}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Montant brut :</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.montant_brut ? "is-invalid" : ""
                      }`}
                      name="montant_brut"
                      value={reglement.montant_brut}
                      onChange={handleChange}
                    />
                    {errors.montant_brut && (
                      <div className="invalid-feedback">
                        {errors.montant_brut}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Base retenue source :</label>
                    <input
                      type="text"
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
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Taux retenue source :</label>
                    <select
                      style={{ color: "black" }}
                      className={`form-control ${
                        errors.taux_retenue_source ? "is-invalid" : ""
                      }`}
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
                      <div className="invalid-feedback">
                        {errors.taux_retenue_source}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Montant retenue source :</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.montant_retenue_source ? "is-invalid" : ""
                      }`}
                      name="montant_retenue_source"
                      value={reglement.montant_retenue_source}
                      onChange={handleChange}
                    />
                    {errors.retenue_source && (
                      <div className="invalid-feedback">
                        {errors.retenue_source}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Montant net :</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.montant_net ? "is-invalid" : ""
                      }`}
                      name="montant_net"
                      value={reglement.montant_net}
                      onChange={handleChange}
                    />
                    {errors.montant_net && (
                      <div className="invalid-feedback">
                        {errors.montant_net}
                      </div>
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
                  Enregistrer
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddReglement;
