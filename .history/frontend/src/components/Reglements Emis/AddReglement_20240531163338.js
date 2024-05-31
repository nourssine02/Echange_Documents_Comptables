import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddReglement.css";

const AddReglement = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { reglement, payements, pieces };
    axios
      .post("http://localhost:5000/reglements_emis", data)
      .then((response) => {
        console.log(response.data.message);
        setReglement(initialReglementState);
        setPayements([initialPayementState]);
        setPieces([initialPieceState]);
        alert("Données ajoutées avec succès.");
        navigate("/reglements_emis");
      })
      .catch((error) => {
        console.error("Erreur lors de l'ajout du règlement :", error);
        if (error.response) {
          console.error("Contenu de la réponse :", error.response.data);
        } else {
          console.error("Aucune réponse reçue.");
        }
        alert("Erreur lors de l'ajout du règlement: " + error.message);
      });
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
                <div className="col-md-4">
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
                <div className="col-md-4">
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
                <div className="col-md-4">
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
                          <option value="Banques locales">
                            Banques locales
                          </option>
                        </select>
                  </div>
                </div>
                <div className="col-md-4">
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
                <div className="col-md-4">
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
                <div className="col-md-4">
                  <button
                    type="button"
                    style={{marginTop: "30px"}}
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
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Numéro de pièce à régler :</label>
                    <input
                      type="text"
                      className="form-control"
                      name="num_piece_a_regler"
                      onChange={(e) => handleChangePiece(e, index)}
                      value={piece.num_piece_a_regler}
                    />
                  </div>
                </div>
                <div className="col-md-4">
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
                <div className="col-md-4">
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
                <div className="col-md-4">
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
                <div className="col-md-4">
                  <button
                    type="button"
                    style={{marginTop: "30px"}}
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
      <div className="content-wrapper">
        <div className="card">
          <div className="card-body">
            <br />
            <h2>Ajouter un règlement Émis</h2>
            <form onSubmit={handleSubmit} className="forms-sample">
              <div className="row">
                <div className="col-md-6">
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
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Code tiers :</label>
                    <select
                      style={{ color: "black" }}
                      className="form-control"
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
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Tiers à Saisir :</label>
                    <input
                      type="text"
                      className="form-control"
                      name="tiers_saisie"
                      value={reglement.tiers_saisie}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Montant brut :</label>
                    <input
                      type="text"
                      className="form-control"
                      name="montant_brut"
                      value={reglement.montant_brut}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Base retenue source :</label>
                    <input
                      type="text"
                      className="form-control"
                      name="base_retenue_source"
                      value={reglement.base_retenue_source}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Taux retenue source :</label>
                    <select
                      style={{ color: "black" }}
                      className="form-control"
                      name="taux_retenue_source"
                      onChange={handleChange}
                      value={reglement.taux_retenue_source}
                    >
                      <option value="" style={{ color: "black" }}>Sélectionnez...</option>
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
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Montant retenue source :</label>
                    <input
                      type="text"
                      className="form-control"
                      name="montant_retenue_source"
                      value={reglement.montant_retenue_source}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Montant net :</label>
                    <input
                      type="text"
                      className="form-control"
                      name="montant_net"
                      value={reglement.montant_net}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Observations :</label>
                    <textarea
                      className="form-control"
                      name="observations"
                      placeholder="Entrez vos observations ici..."
                      rows={5}
                      cols={50}
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
              <button type="submit" className="btn btn-primary">
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
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddReglement;
