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


  const initialPayementState = useMemo(() => ({
    modalite: "",
    num: "",
    banque: "",
    date_echeance: "",
    montant: "",
  }), []);

  const initialPieceState = useMemo(() => ({
    num_piece_a_regler: "",
    date_piece_a_regler: "",
    montant_piece_a_regler: "",
    document_fichier: "",
  }), []);

  const [reglement, setReglement] = useState(initialReglementState);
  const [payements, setPayements] = useState([initialPayementState]);
  const [pieces, setPieces] = useState([initialPieceState]);
  const [codeTiers, setCodeTiers] = useState([]);
  const [taux, setTaux] = useState([]);
  const [activeTab, setActiveTab] = useState("payements");
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
        const res = await axios.get("http://localhost:5000/taux_retenue_source/active");
        console.log(res.data);  // Ajoutez cette ligne pour déboguer
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
            <div  className="row">
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
                        <option value="Banques locales">
                          Banques locales
                        </option>
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
              <div>
              <div key={index} className="row">
                <div className="col-md-3">
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
      <div className={`content-wrapper ${isSidebarOpen ? 'shifted' : ''}`}>
      <div className="card">
          <div className="card-body">
            <br />
            <h2 className="text-center">Modifier un règlement Émi</h2>
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
                <div className="col-md-4">
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
                <div className="col-md-4">
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
                <div className="col-md-4">
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
                <div className="col-md-4">
  <div className="form-group">
    <label>Taux retenue à la source :</label>
    <select
      style={{ color: "black" }}
      className="form-control"
      name="taux_retenue_source"
      onChange={handleChange}
      value={reglement.taux_retenue_source}
    >
      <option value="" style={{ color: "black" }}>Sélectionnez...</option>
      {taux.map((tau) => (
        <option
          key={tau.taux}
          value={tau.taux}
          style={{ color: "black" }}
        >
          {tau.taux}%
        </option>
      ))}
    </select>
  </div>
</div>

                <div className="col-md-4">
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
                <div className="col-md-4">
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
              <div 
                className="d-flex justify-content-center"
              >
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

export default UpdateReglement;
