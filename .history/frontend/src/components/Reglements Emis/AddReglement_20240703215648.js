import React, { useState, useEffect } from "react";
import axios from "axios";

const AddReglement = () => {
  const [reglement, setReglement] = useState({
    date_saisie: "",
    code_tiers: "",
    tiers_saisie: "",
    montant_brut: "",
    base_retenue_source: "",
    taux_retenue_source: "",
    retenue_source: "",
    montant_net: "",
    type_reglement: "",
    num_piece: "",
    date_piece: "",
    montant_piece: "",
    commentaire: "",
  });
  const [payements, setPayements] = useState([
    { mode: "", banque: "", date_echeance: "", montant: "" },
  ]);
  const [pieces, setPieces] = useState([
    { num_piece_a_regler: "", date_piece_a_regler: "", montant_piece_a_regler: "", document_fichier: null },
  ]);
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState(null);
  const [codeTiers, setCodeTiers] = useState([]);
  const [taux, setTaux] = useState([]);
  const [typeReglements, setTypeReglements] = useState([]);
  const [selectedModule, setSelectedModule] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tiersResponse, tauxResponse, typeReglementsResponse] = await Promise.all([
          axios.get("/api/tiers"),
          axios.get("/api/taux"),
          axios.get("/api/type-reglements"),
        ]);

        setCodeTiers(tiersResponse.data);
        setTaux(tauxResponse.data);
        setTypeReglements(typeReglementsResponse.data);
      } catch (error) {
        console.error("Erreur lors du chargement des données :", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReglement((prevReglement) => ({
      ...prevReglement,
      [name]: value,
    }));
  };

  const handleChangePayement = (e, index) => {
    const { name, value } = e.target;
    const newPayements = [...payements];
    newPayements[index][name] = value;
    setPayements(newPayements);
  };

  const handleChangePiece = (e, index) => {
    const { name, value, files } = e.target;
    const newPieces = [...pieces];
    newPieces[index][name] = files ? files[0] : value;
    setPieces(newPieces);
  };

  const addPayement = () => {
    setPayements([...payements, { mode: "", banque: "", date_echeance: "", montant: "" }]);
  };

  const removePayement = (index) => {
    const newPayements = [...payements];
    newPayements.splice(index, 1);
    setPayements(newPayements);
  };

  const addPiece = () => {
    setPieces([...pieces, { num_piece_a_regler: "", date_piece_a_regler: "", montant_piece_a_regler: "", document_fichier: null }]);
  };

  const removePiece = (index) => {
    const newPieces = [...pieces];
    newPieces.splice(index, 1);
    setPieces(newPieces);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!reglement.date_saisie) newErrors.date_saisie = "La date de saisie est requise.";
    if (!reglement.code_tiers) newErrors.code_tiers = "Le code tiers est requis.";
    if (!reglement.tiers_saisie) newErrors.tiers_saisie = "Le tiers saisie est requis.";
    if (!reglement.montant_brut) newErrors.montant_brut = "Le montant brut est requis.";
    if (!reglement.base_retenue_source) newErrors.base_retenue_source = "La base retenue source est requise.";
    if (!reglement.taux_retenue_source) newErrors.taux_retenue_source = "Le taux retenue source est requis.";
    if (!reglement.retenue_source) newErrors.retenue_source = "La retenue source est requise.";
    if (!reglement.montant_net) newErrors.montant_net = "Le montant net est requis.";
    if (!reglement.type_reglement) newErrors.type_reglement = "Le type de règlement est requis.";
    if (!reglement.num_piece) newErrors.num_piece = "Le numéro de pièce est requis.";
    if (!reglement.date_piece) newErrors.date_piece = "La date de pièce est requise.";
    if (!reglement.montant_piece) newErrors.montant_piece = "Le montant de la pièce est requis.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setAlert({ type: "danger", message: "Veuillez corriger les erreurs dans le formulaire." });
      return;
    }

    const formData = new FormData();
    Object.keys(reglement).forEach((key) => formData.append(key, reglement[key]));

    payements.forEach((payement, index) => {
      formData.append(`payements[${index}][mode]`, payement.mode);
      formData.append(`payements[${index}][banque]`, payement.banque);
      formData.append(`payements[${index}][date_echeance]`, payement.date_echeance);
      formData.append(`payements[${index}][montant]`, payement.montant);
    });

    pieces.forEach((piece, index) => {
      formData.append(`pieces[${index}][num_piece_a_regler]`, piece.num_piece_a_regler);
      formData.append(`pieces[${index}][date_piece_a_regler]`, piece.date_piece_a_regler);
      formData.append(`pieces[${index}][montant_piece_a_regler]`, piece.montant_piece_a_regler);
      formData.append(`pieces[${index}][document_fichier]`, piece.document_fichier);
    });

    try {
      const response = await axios.post("/api/reglements", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setAlert({ type: "success", message: "Le règlement a été ajouté avec succès." });
      setReglement({
        date_saisie: "",
        code_tiers: "",
        tiers_saisie: "",
        montant_brut: "",
        base_retenue_source: "",
        taux_retenue_source: "",
        retenue_source: "",
        montant_net: "",
        type_reglement: "",
        num_piece: "",
        date_piece: "",
        montant_piece: "",
        commentaire: "",
      });
      setPayements([{ mode: "", banque: "", date_echeance: "", montant: "" }]);
      setPieces([{ num_piece_a_regler: "", date_piece_a_regler: "", montant_piece_a_regler: "", document_fichier: null }]);
      setSelectedModule("");
    } catch (error) {
      setAlert({ type: "danger", message: "Erreur lors de l'ajout du règlement." });
      console.error("Erreur lors de l'ajout du règlement :", error);
    }
  };

  const renderAdditionalFields = () => {
    switch (selectedModule) {
      case "payement":
        return (
          <div>
            <h3>Paiements</h3>
            {payements.map((payement, index) => (
              <div key={index} className="row">
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Mode :</label>
                    <input
                      type="text"
                      className={`form-control ${errors[`payement_${index}`] ? 'is-invalid' : ''}`}
                      name="mode"
                      onChange={(e) => handleChangePayement(e, index)}
                      value={payement.mode}
                    />
                    {errors[`payement_${index}`] && (
                      <div className="invalid-feedback">
                        {errors[`payement_${index}`]}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Banque :</label>
                    <input
                      type="text"
                      className={`form-control ${errors[`payement_${index}`] ? 'is-invalid' : ''}`}
                      name="banque"
                      onChange={(e) => handleChangePayement(e, index)}
                      value={payement.banque}
                    />
                    {errors[`payement_${index}`] && (
                      <div className="invalid-feedback">
                        {errors[`payement_${index}`]}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Date d'échéance :</label>
                    <input
                      type="date"
                      className={`form-control ${errors[`payement_${index}`] ? 'is-invalid' : ''}`}
                      name="date_echeance"
                      onChange={(e) => handleChangePayement(e, index)}
                      value={payement.date_echeance}
                    />
                    {errors[`payement_${index}`] && (
                      <div className="invalid-feedback">
                        {errors[`payement_${index}`]}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <label>Montant :</label>
                    <input
                      type="number"
                      className={`form-control ${errors[`payement_${index}`] ? 'is-invalid' : ''}`}
                      name="montant"
                      onChange={(e) => handleChangePayement(e, index)}
                      value={payement.montant}
                    />
                    {errors[`payement_${index}`] && (
                      <div className="invalid-feedback">
                        {errors[`payement_${index}`]}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-1">
                  <button
                    type="button"
                    className="btn btn-danger mt-4"
                    onClick={() => removePayement(index)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
            <button type="button" className="btn btn-secondary" onClick={addPayement}>
              Ajouter un paiement
            </button>
          </div>
        );
      case "pieces":
        return (
          <div>
            <h3>Pièces à régler</h3>
            {pieces.map((piece, index) => (
              <div key={index} className="row">
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Numéro de pièce à régler :</label>
                    <input
                      type="text"
                      className={`form-control ${errors[`piece_${index}`] ? 'is-invalid' : ''}`}
                      name="num_piece_a_regler"
                      onChange={(e) => handleChangePiece(e, index)}
                      value={piece.num_piece_a_regler}
                    />
                    {errors[`piece_${index}`] && (
                      <div className="invalid-feedback">
                        {errors[`piece_${index}`]}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Date de pièce à régler :</label>
                    <input
                      type="date"
                      className={`form-control ${errors[`piece_${index}`] ? 'is-invalid' : ''}`}
                      name="date_piece_a_regler"
                      onChange={(e) => handleChangePiece(e, index)}
                      value={piece.date_piece_a_regler}
                    />
                    {errors[`piece_${index}`] && (
                      <div className="invalid-feedback">
                        {errors[`piece_${index}`]}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Montant de la pièce à régler :</label>
                    <input
                      type="number"
                      className={`form-control ${errors[`piece_${index}`] ? 'is-invalid' : ''}`}
                      name="montant_piece_a_regler"
                      onChange={(e) => handleChangePiece(e, index)}
                      value={piece.montant_piece_a_regler}
                    />
                    {errors[`piece_${index}`] && (
                      <div className="invalid-feedback">
                        {errors[`piece_${index}`]}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <label>Document :</label>
                    <input
                      type="file"
                      className={`form-control ${errors[`piece_${index}`] ? 'is-invalid' : ''}`}
                      name="document_fichier"
                      onChange={(e) => handleChangePiece(e, index)}
                    />
                    {errors[`piece_${index}`] && (
                      <div className="invalid-feedback">
                        {errors[`piece_${index}`]}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-1">
                  <button
                    type="button"
                    className="btn btn-danger mt-4"
                    onClick={() => removePiece(index)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
            <button type="button" className="btn btn-secondary" onClick={addPiece}>
              Ajouter une pièce
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container">
      <h2>Ajouter un règlement</h2>
      {alert && (
        <div className={`alert alert-${alert.type}`} role="alert">
          {alert.message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Date de saisie :</label>
          <input
            type="date"
            className={`form-control ${errors.date_saisie ? 'is-invalid' : ''}`}
            name="date_saisie"
            onChange={handleChange}
            value={reglement.date_saisie}
          />
          {errors.date_saisie && (
            <div className="invalid-feedback">{errors.date_saisie}</div>
          )}
        </div>
        <div className="form-group">
          <label>Code tiers :</label>
          <select
            className={`form-control ${errors.code_tiers ? 'is-invalid' : ''}`}
            name="code_tiers"
            onChange={handleChange}
            value={reglement.code_tiers}
          >
            <option value="">Sélectionnez...</option>
            {codeTiers.map((tiers) => (
              <option key={tiers.code_tiers} value={tiers.code_tiers}>
                {tiers.code_tiers}
              </option>
            ))}
          </select>
          {errors.code_tiers && (
            <div className="invalid-feedback">{errors.code_tiers}</div>
          )}
        </div>
        <div className="form-group">
          <label>Tiers saisie :</label>
          <input
            type="text"
            className={`form-control ${errors.tiers_saisie ? 'is-invalid' : ''}`}
            name="tiers_saisie"
            onChange={handleChange}
            value={reglement.tiers_saisie}
          />
          {errors.tiers_saisie && (
            <div className="invalid-feedback">{errors.tiers_saisie}</div>
          )}
        </div>
        <div className="form-group">
          <label>Montant brut :</label>
          <input
            type="number"
            className={`form-control ${errors.montant_brut ? 'is-invalid' : ''}`}
            name="montant_brut"
            onChange={handleChange}
            value={reglement.montant_brut}
          />
          {errors.montant_brut && (
            <div className="invalid-feedback">{errors.montant_brut}</div>
          )}
        </div>
        <div className="form-group">
          <label>Base retenue source :</label>
          <input
            type="number"
            className={`form-control ${errors.base_retenue_source ? 'is-invalid' : ''}`}
            name="base_retenue_source"
            onChange={handleChange}
            value={reglement.base_retenue_source}
          />
          {errors.base_retenue_source && (
            <div className="invalid-feedback">{errors.base_retenue_source}</div>
          )}
        </div>
        <div className="form-group">
          <label>Taux retenue source :</label>
          <select
            className={`form-control ${errors.taux_retenue_source ? 'is-invalid' : ''}`}
            name="taux_retenue_source"
            onChange={handleChange}
            value={reglement.taux_retenue_source}
          >
            <option value="">Sélectionnez...</option>
            {taux.map((tauxItem) => (
              <option key={tauxItem.taux_retenue_source} value={tauxItem.taux_retenue_source}>
                {tauxItem.taux_retenue_source}
              </option>
            ))}
          </select>
          {errors.taux_retenue_source && (
            <div className="invalid-feedback">{errors.taux_retenue_source}</div>
          )}
        </div>
        <div className="form-group">
          <label>Retenue source :</label>
          <input
            type="number"
            className={`form-control ${errors.retenue_source ? 'is-invalid' : ''}`}
            name="retenue_source"
            onChange={handleChange}
            value={reglement.retenue_source}
          />
          {errors.retenue_source && (
            <div className="invalid-feedback">{errors.retenue_source}</div>
          )}
        </div>
        <div className="form-group">
          <label>Montant net :</label>
          <input
            type="number"
            className={`form-control ${errors.montant_net ? 'is-invalid' : ''}`}
            name="montant_net"
            onChange={handleChange}
            value={reglement.montant_net}
          />
          {errors.montant_net && (
            <div className="invalid-feedback">{errors.montant_net}</div>
          )}
        </div>
        <div className="form-group">
          <label>Type de règlement :</label>
          <select
            className={`form-control ${errors.type_reglement ? 'is-invalid' : ''}`}
            name="type_reglement"
            onChange={handleChange}
            value={reglement.type_reglement}
          >
            <option value="">Sélectionnez...</option>
            {typeReglements.map((type) => (
              <option key={type.type_reglement} value={type.type_reglement}>
                {type.type_reglement}
              </option>
            ))}
          </select>
          {errors.type_reglement && (
            <div className="invalid-feedback">{errors.type_reglement}</div>
          )}
        </div>
        <div className="form-group">
          <label>Numéro de pièce :</label>
          <input
            type="text"
            className={`form-control ${errors.num_piece ? 'is-invalid' : ''}`}
            name="num_piece"
            onChange={handleChange}
            value={reglement.num_piece}
          />
          {errors.num_piece && (
            <div className="invalid-feedback">{errors.num_piece}</div>
          )}
        </div>
        <div className="form-group">
          <label>Date de pièce :</label>
          <input
            type="date"
            className={`form-control ${errors.date_piece ? 'is-invalid' : ''}`}
            name="date_piece"
            onChange={handleChange}
            value={reglement.date_piece}
          />
          {errors.date_piece && (
            <div className="invalid-feedback">{errors.date_piece}</div>
          )}
        </div>
        <div className="form-group">
          <label>Montant de la pièce :</label>
          <input
            type="number"
            className={`form-control ${errors.montant_piece ? 'is-invalid' : ''}`}
            name="montant_piece"
            onChange={handleChange}
            value={reglement.montant_piece}
          />
          {errors.montant_piece && (
            <div className="invalid-feedback">{errors.montant_piece}</div>
          )}
        </div>
        <div className="form-group">
          <label>Commentaire :</label>
          <textarea
            className="form-control"
            name="commentaire"
            onChange={handleChange}
            value={reglement.commentaire}
          ></textarea>
        </div>
        <div className="form-group">
          <label>Module supplémentaire :</label>
          <select
            className="form-control"
            onChange={(e) => setSelectedModule(e.target.value)}
            value={selectedModule}
          >
            <option value="">Sélectionnez...</option>
            <option value="payement">Paiement</option>
            <option value="pieces">Pièces à régler</option>
          </select>
        </div>
        {renderAdditionalFields()}
        <button type="submit" className="btn btn-primary">Ajouter le règlement</button>
      </form>
    </div>
  );
};

export default AddReglement;
