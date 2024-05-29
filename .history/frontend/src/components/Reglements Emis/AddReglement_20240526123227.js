import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddReglement.css';

const AddReglement = ({ type }) => {
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

  const addPayement = () => {
    setPayements([...payements, initialPayementState]);
  };

  const removePayement = (index) => {
    const updatedPayements = [...payements];
    updatedPayements.splice(index, 1);
    setPayements(updatedPayements);
  };

  const handleChangePiece = (e, index) => {
    const { name, value, files } = e.target;
    if (name === "document_fichier") {
      if (files.length > 0) {
        const file = files[0];
        const reader = new FileReader();
        reader.onload = () => {
          const base64Data = reader.result.split(",")[1];
          const url = `data:${file.type};base64,${base64Data}`;
          const updatedPieces = [...pieces];
          updatedPieces[index][name] = url;
          setPieces(updatedPieces);
        };
        reader.onerror = (err) => {
          console.error("Erreur lors de la lecture du fichier:", err);
        };
        reader.readAsDataURL(file);
      }
    } else {
      const updatedPieces = [...pieces];
      updatedPieces[index][name] = value;
      setPieces(updatedPieces);
    }
  };

  const addPiece = () => {
    setPieces([...pieces, initialPieceState]);
  };

  const removePiece = (index) => {
    const updatedPieces = [...pieces];
    updatedPieces.splice(index, 1);
    setPieces(updatedPieces);
  };

  const handleCancel = () => {
    navigate("/reglements_emis");
  };

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <div className="card">
          <div className="card-body">
            <h1>Ajouter un Règlement Emis</h1>
            <form className="forms-sample" onSubmit={handleSubmit}>
              {type === 'pieces' && pieces.map((piece, index) => (
                <div key={index} className="mb-3">
                  <legend>Pièce à régler {index + 1}</legend>
                  <div className="row">
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>N° Pièce à régler:</label>
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
                        <label>Date Pièce à régler:</label>
                        <input
                          type="date"
                          className="form-control"
                          name="date_piece_a_regler"
                          value={piece.date_piece_a_regler}
                          onChange={(e) => handleChangePiece(e, index)}
                          max={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Montant Pièce à régler:</label>
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
                        <label>Document / Fichier:</label>
                        <input
                          type="file"
                          className="form-control"
                          name="document_fichier"
                          onChange={(e) => handleChangePiece(e, index)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-start">
                    <button
                      onClick={() => removePiece(index)}
                      type="button"
                      className="btn btn-danger btn-sm me-2"
                    >
                      <i className="fas fa-minus"></i> Retirer
                    </button>
                    <button
                      onClick={addPiece}
                      type="button"
                      className="btn btn-primary btn-sm"
                    >
                      <i className="fas fa-plus"></i> Ajouter une pièce
                    </button>
                  </div>
                </div>
              ))}

              {type === 'paiements' && payements.map((payement, index) => (
                <div key={index} className="mb-3">
                  <legend>Paiement {index + 1}</legend>
                  <div className="row">
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Modalité:</label>
                        <select
                          className="form-control"
                          name="modalite"
                          value={payement.modalite}
                          onChange={(e) => handleChangePayement(e, index)}
                        >
                          <option value="">Sélectionner</option>
                          <option value="Virement">Virement</option>
                          <option value="Chèque">Chèque</option>
                          <option value="Espèces">Espèces</option>
                          <option value="Traite">Traite</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Numéro:</label>
                        <input
                          type="text"
                          className="form-control"
                          name="num"
                          value={payement.num}
                          onChange={(e) => handleChangePayement(e, index)}
                        />
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="form-group">
                        <label>Banque:</label>
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
                        <label>Date échéance:</label>
                        <input
                          type="date"
                          className="form-control"
                          name="date_echeance"
                          value={payement.date_echeance}
                          onChange={(e) => handleChangePayement(e, index)}
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Montant:</label>
                        <input
                          type="number"
                          className="form-control"
                          name="montant"
                          value={payement.montant}
                          onChange={(e) => handleChangePayement(e, index)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-start">
                    <button
                      onClick={() => removePayement(index)}
                      type="button"
                      className="btn btn-danger btn-sm me-2"
                    >
                      <i className="fas fa-minus"></i> Retirer
                    </button>
                    <button
                      onClick={addPayement}
                      type="button"
                      className="btn btn-primary btn-sm"
                    >
                      <i className="fas fa-plus"></i> Ajouter un paiement
                    </button>
                  </div>
                </div>
              ))}

              <legend>Informations de règlement</legend>
              <div className="row">
                <div className="col-md-2">
                  <div className="form-group">
                    <label>Date de saisie:</label>
                    <input
                      type="date"
                      className="form-control"
                      name="date_saisie"
                      value={reglement.date_saisie}
                      onChange={handleChange}
                      max={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <label>Code Tiers:</label>
                    <input
                      type="text"
                      list="codeTiers"
                      className="form-control"
                      name="code_tiers"
                      value={reglement.code_tiers}
                      onChange={handleChange}
                      required
                    />
                    <datalist id="codeTiers">
                      {codeTiers.map((codeTier, index) => (
                        <option key={index} value={codeTier.code_tiers}>
                          {codeTier.identite}
                        </option>
                      ))}
                    </datalist>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Tiers saisi:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="tiers_saisie"
                      value={reglement.tiers_saisie}
                      readOnly
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <label>Montant brut:</label>
                    <input
                      type="number"
                      className="form-control"
                      name="montant_brut"
                      value={reglement.montant_brut}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Base Retenue source:</label>
                    <input
                      type="number"
                      className="form-control"
                      name="base_retenue_source"
                      value={reglement.base_retenue_source}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-2">
                  <div className="form-group">
                    <label>Taux Retenue source:</label>
                    <input
                      type="number"
                      className="form-control"
                      name="taux_retenue_source"
                      value={reglement.taux_retenue_source}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Montant Retenue source:</label>
                    <input
                      type="number"
                      className="form-control"
                      name="montant_retenue_source"
                      value={reglement.montant_retenue_source}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-2">
                  <div className="form-group">
                    <label>Montant net:</label>
                    <input
                      type="number"
                      className="form-control"
                      name="montant_net"
                      value={reglement.montant_net}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-5">
                  <div className="form-group">
                    <label>Observations:</label>
                    <textarea
                      className="form-control"
                      name="observations"
                      value={reglement.observations}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary me-2">Enregistrer</button>
              <button type="button" className="btn btn-light" onClick={handleCancel}>Annuler</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddReglement;
