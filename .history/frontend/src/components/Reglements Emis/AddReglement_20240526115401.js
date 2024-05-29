import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "code_tiers") {
      const selectedCodeTier = codeTiers.find((codeTier) => codeTier.code_tiers === value);
      if (selectedCodeTier) {
        setReglement((prev) => ({
          ...prev,
          code_tiers: selectedCodeTier.code_tiers, 
          tiers_saisie: selectedCodeTier.identite // Mettre à jour le champ tiers_saisie avec l'identité correspondante
        }));
      } else {
        // If no code tier is selected, reset tiers_saisie to an empty string
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
    setPayements([
      ...payements,
      {
        modalite: "",
        num: "",
        banque: "",
        date_echeance: "",
        montant: "",
      },
    ]);
  };

  const removePayement = (index) => {
    const updatedPayements = [...payements];
    updatedPayements.splice(index, 1);
    setPayements(updatedPayements);
  };



  const handleFileChange = (files) => {
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
  
      reader.onload = () => {
        const base64Data = reader.result.split(',')[1]; // Extraire les données base64
        const url = `data:${file.type};base64,${base64Data}`; // Utiliser le type MIME réel du fichier
  
        setPieces((prev) => ({ ...prev, document_fichier: url }));
      };
  
      reader.onerror = (err) => {
        console.error('Erreur lors de la lecture du fichier:', err);
        // Gérez les erreurs de lecture si nécessaire
      };
  
      reader.readAsDataURL(file);
    }
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
  
  const addPiece = () => {
    setPieces([
      ...pieces,
      {
        num_piece_a_regler: "",
        date_piece_a_regler: "",
        montant_piece_a_regler: "",
        document_fichier: "",
      },
    ]);
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
            <br />
            <form className="forms-sample" onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Date de Saisie:</label>
                    <input
                      type="date"
                      className="form-control"
                      name="date_saisie"
                      onChange={handleChange}
                      value={reglement.date_saisie}
                    />
                  </div>
                  <div className="form-group">
                    <label>Code Tiers:</label>

                    <select
                      style={{ color: "black" }}
                      className="form-control form-control-lg"
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
                    <label>Montant Brut:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="montant_brut"
                      onChange={handleChange}
                      placeholder="Montant Brut"
                      value={reglement.montant_brut}
                    />
                  </div>
                  <div className="form-group">
                    <label>Base de la retenue à la source :</label>
                    <input
                      type="text"
                      className="form-control"
                      name="base_retenue_source"
                      onChange={handleChange}
                      placeholder="Base de la retenue à la source"
                      value={reglement.base_retenue_source}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label>Tiers à Saisir:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="tiers_saisie"
                      onChange={handleChange}
                      value={reglement.tiers_saisie}
                    />
                  </div>
                  
                  
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label>Taux de la retenue à la source :</label>
                    <select
                      style={{ color: "black" }}
                      className="form-control"
                      name="taux_retenue_source"
                      onChange={handleChange}
                      value={reglement.taux_retenue_source}
                    >
                      <option value="">Sélectionnez...</option>
                      <option value="1%">1%</option>
                      <option value="1,5%">1,5%</option>
                      <option value="3%">3%</option>
                      <option value="5%">5%</option>
                      <option value="10%">10%</option>
                      <option value="15%">15%</option>
                      <option value="20%">20%</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Montant de la retenue à la source :</label>
                    <input
                      type="text"
                      className="form-control"
                      name="montant_retenue_source"
                      onChange={handleChange}
                      placeholder="Montant de la retenue à la source "
                      value={reglement.montant_retenue_source}
                    />
                  </div>

                 
                </div>
                <div className="col-md-6">

                  <div className="form-group">
                    <label>Observations:</label>
                    <textarea
                      className="form-control"
                      name="observations"
                      onChange={handleChange}
                      placeholder="Entrez vos observations ici..."
                      rows={5}
                      cols={50}
                      value={reglement.observations}
                    />
                  </div>

                
                </div>
              </div>
              <br></br>
              <br></br>
              <hr />

              {pieces.map((piece, index) => (
                <div key={index} className="mb-3">
                  <legend>Pièce à régler {index + 1}</legend>
                  <div className="row">
                    <div className="col-md-18 ml-2">
                      <div className="d-inline-flex">
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
                        <div className="form-group">
                          <label>Dates Pièces à régler:</label>
                          <input
                            type="date"
                            className="form-control"
                            name="date_piece_a_regler"
                            value={piece.date_piece_a_regler}
                            onChange={(e) => handleChangePiece(e, index)}
                            max={new Date().toISOString().split("T")[0]}
                          />
                        </div>
                        <div className="form-group">
                          <label>Montants Pièces à régler:</label>
                          <input
                            type="number"
                            className="form-control"
                            name="montant_piece_a_regler"
                            value={piece.montant_piece_a_regler}
                            onChange={(e) => handleChangePiece(e, index)}
                          />
                        </div>
                        <div className="form-group">
                          <label>Document / Fichier à Insérer :</label>
                          <input
                            type="file"
                            className="form-control"
                            name="document_fichier"
                            onChange={(e) => handleChangePiece(e, index)}
                          />
                        </div>
                        <br />
                        <div className="d-flex align-items-start">
                          <div className="col-md">
                            <button
                              onClick={() => removePiece(index)}
                              type="button"
                              className="btn btn-danger btn-sm mt-2 me-2"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                            &nbsp;
                            {index === pieces.length - 1 && (
                              <button
                                onClick={addPiece}
                                type="button"
                                className="btn btn-success btn-sm mt-2"
                              >
                                <i className="bi bi-plus-circle"></i>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <hr />
              <br></br>
              <legend>paiements :</legend>
              {payements.map((payement, index) => (
                <div className="row" key={index}>
                  <div className="col-md-18 ml-2">
                    <div className="d-inline-flex">
                      <div className="form-group">
                        <label>Modalité:</label>
                        <select
                          style={{ color: "black" }}
                          value={payement.modalite}
                          name="modalite"
                          className="form-control mr-5"
                          onChange={(e) => handleChangePayement(e, index)}
                        >
                          <option value="">Sélectionnez une option</option>
                          <option value="Chèque">Chèque</option>
                          <option value="Effet">Effet</option>
                          <option value="CB">CB</option>
                          <option value="Virement">Virement</option>
                          <option value="Retrait de fonds">
                            Retrait de fonds
                          </option>
                        </select>
                      </div>{" "}
                      <div className="form-group">
                        <label>Numéro:</label>
                        <input
                          type="text"
                          value={payement.num}
                          name="num"
                          className="form-control"
                          onChange={(e) => handleChangePayement(e, index)}
                        />
                      </div>{" "}
                      <div className="form-group">
                        <label>Banque:</label>
                        <select
                          style={{ color: "black" }}
                          value={payement.banque}
                          name="banque"
                          className="form-control mr-5"
                          onChange={(e) => handleChangePayement(e, index)}
                        >
                          <option value="">Sélectionnez une option</option>
                          <option value="Banques locales">
                            Banques locales
                          </option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Date d'échéance:</label>
                        <input
                          type="date"
                          value={payement.date_echeance}
                          name="date_echeance"
                          className="form-control"
                          onChange={(e) => handleChangePayement(e, index)}
                        />
                      </div>{" "}
                      <div className="form-group">
                        <label>Montant:</label>
                        <input
                          type="number"
                          value={payement.montant}
                          name="montant"
                          className="form-control"
                          onChange={(e) => handleChangePayement(e, index)}
                        />
                      </div>
                      <br></br>
                      <div className="d-flex align-items-start">
                        <div className="col-md">
                          <button
                            onClick={() => removePayement(index)}
                            type="button"
                            className="btn btn-danger btn-sm mt-2 me-2"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                          &nbsp;
                          {index === payements.length - 1 && (
                            <button
                              onClick={addPayement}
                              type="button"
                              className="btn btn-success btn-sm mt-2"
                            >
                              <i className="bi bi-plus-circle"></i>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <br></br>
              <div
                className="button d-flex align-items-center"
                style={{ gap: "10px", marginLeft: "300px" }}
              >
                <button
                  type="submit"
                  className="btn btn-primary mr-2"
                  style={{ marginBottom: "5px" }}
                >
                  Ajouter
                </button>
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
