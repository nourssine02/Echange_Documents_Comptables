import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AddReglementRecu = () => {
  const initialReglementState = {
    code_tiers: "",
    tiers_saisie: "",
    montant_total_a_regler: "",
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
  const [pieces, setPieces] = useState([initialPieceState]); // Initialize as an array

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { reglement, payements, pieces };

    axios
      .post("http://localhost:5000/reglements_recus", data)
      .then((response) => {
        console.log(response.data.message);
        setReglement(initialReglementState);
        setPayements([initialPayementState]);
        setPieces([initialPieceState]);
        alert("Données ajoutées avec succès.");
        navigate("/reglements_recus");
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
    setReglement({ ...reglement, [name]: value });
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

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const updatedPieces = [...pieces];
      if (updatedPieces[index]) {
        const reader = new FileReader();
        reader.onload = () => {
          const base64Data = reader.result.split(",")[1];
          const url = `data:${file.type};base64,${base64Data}`;
          updatedPieces[index].document_fichier = url;
          setPieces(updatedPieces);
        };
        reader.readAsDataURL(file);
      }
    }
  };
  
  
  const handleChangePiece = (e, index) => {
    const { name, value } = e.target;
    const updatedPieces = [...pieces];
    updatedPieces[index][name] = value;
    setPieces(updatedPieces);
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
    navigate("/reglements_recus");
  };

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <div className="card">
          <div className="card-body">
            <h1>Ajouter un Règlement Reçus</h1>
            <br />
            <form className="forms-sample" onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
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
                  <div className="form-group">
                    <label>Tiers Saisie:</label>
                    <input
                      type="text"
                      name="tiers_saisie"
                      value={reglement.tiers_saisie}
                      onChange={handleChange}
                      required
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Montant Total à Régler :</label>
                    <input
                      type="number"
                      name="montant_total_a_regler"
                      value={reglement.montant_total_a_regler}
                      onChange={handleChange}
                      required
                      className="form-control"
                    />
                  </div>

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
                  <legend>Facture à régler {index + 1}</legend>
                  <div className="row">
                    <div className="col-md-18 ml-2">
                      <div className="d-inline-flex">
                        <div className="form-group">
                          <label>N° Facture à régler:</label>
                          <input
                            type="text"
                            className="form-control"
                            name="num_piece_a_regler"
                            value={piece.num_piece_a_regler}
                            onChange={(e) => handleChangePiece(e, index)}
                          />
                        </div>
                        <div className="form-group">
                          <label>Dates Facture à régler:</label>
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
                          <label>Montants Facture à régler:</label>
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
                            onChange={(e) => handleFileChange(e, index)} 
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
                        <label>Nature:</label>
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

export default AddReglementRecu;
