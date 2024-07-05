import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UpdateReglement = ({ isSidebarOpen }) => {
  const { id } = useParams();

  const [reglement, setReglement] = useState({
    date_saisie: "",
    code_tiers: "",
    tiers_saisie: "",
    montant_brut: "",
    base_retenue_source: "",
    taux_retenue_source: "",
    montant_retenue_source: "",
    montant_net: "",
    observations: "",
  });

  const [payements, setPayements] = useState([]);
  const [pieces, setPieces] = useState([]);
  const [codeTiers, setCodeTiers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/reglements_emis/${id}`
        );
        const { data } = response;
        setReglement(data.reglement);
        setPayements(data.payements || []); // Ensure payements is an array
        setPieces(data.pieces || []); // Ensure pieces is an array
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("An error occurred while fetching data. Please try again.");
      }
    };

    fetchData();
  }, [id]);

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

  const removePayement = async (index, payementId) => {
    try {
      // Supprimer le payement de la base de données
      await axios.delete(`http://localhost:5000/payements/${payementId}`);

      // Mettre à jour l'état local des payements
      const updatedPayements = payements.filter((_, i) => i !== index);
      setPayements(updatedPayements);
    } catch (error) {
      console.error("Erreur lors de la suppression du payement :", error);
    }
  };

  const handleFileChange = (files, index) => {
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();

      reader.onload = () => {
        const base64Data = reader.result.split(",")[1];
        const url = `data:${file.type};base64,${base64Data}`;

        // Créez une copie de l'array pieces et mettez à jour l'index concerné
        const updatedPieces = [...pieces];
        updatedPieces[index].document_fichier = url;

        // Mettez à jour l'état
        setPieces(updatedPieces);
      };

      reader.onerror = (err) => {
        console.error("Error reading file:", err);
      };

      reader.readAsDataURL(file);
    }
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

  const removePiece = async (index, pieceId) => {
    try {
      // Supprimer le piece de la base de données
      await axios.delete(`http://localhost:5000/pieces_a_regler/${pieceId}`);

      // Mettre à jour l'état local des payements
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
        modalite: payement.modalite,
        num: payement.num,
        banque: payement.banque,
        date_echeance: payement.date_echeance,
        montant: payement.montant,
        reglement_emis_id: id,
      }));

      const formattedPieces = pieces.map((piece) => ({
        num_piece_a_regler: piece.num_piece_a_regler,
        date_piece_a_regler: piece.date_piece_a_regler,
        montant_piece_a_regler: piece.montant_piece_a_regler,
        document_fichier: piece.document_fichier,
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

  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? 'shifted' : ''}`}>
        <div className="card">
          <div className="card-body">
            <h1>Modifier un Règlement Emis</h1>
            <form className="forms-sample" onSubmit={handleSubmit}>
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
                  className="form-control"
                  name="code_tiers"
                  onChange={handleChange}
                  value={reglement.code_tiers}
                >
                  <option value="">Code Tiers</option>
                  {codeTiers.map((codeTier) => (
                    <option key={codeTier.code_tiers} value={codeTier.code_tiers}>
                      {codeTier.code_tiers}
                    </option>
                  ))}
                </select>
              </div>
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
                <label>Tiers à Saisir:</label>
                <input
                  type="text"
                  className="form-control"
                  name="tiers_saisie"
                  onChange={handleChange}
                  placeholder="Tiers à Saisir"
                  value={reglement.tiers_saisie}
                />
              </div>
              <div className="form-group">
                <label>Base de la retenue à la source:</label>
                <input
                  type="text"
                  className="form-control"
                  name="base_retenue_source"
                  onChange={handleChange}
                  placeholder="Base de la retenue à la source"
                  value={reglement.base_retenue_source}
                />
              </div>
              <div className="form-group">
                <label>Taux de la retenue à la source:</label>
                <input
                  type="text"
                  className="form-control"
                  name="taux_retenue_source"
                  onChange={handleChange}
                  placeholder="Taux de la retenue à la source"
                  value={reglement.taux_retenue_source}
                />
              </div>
              <div className="form-group">
                <label>Montant de la retenue à la source:</label>
                <input
                  type="text"
                  className="form-control"
                  name="montant_retenue_source"
                  onChange={handleChange}
                  placeholder="Montant de la retenue à la source"
                  value={reglement.montant_retenue_source}
                />
              </div>
              <div className="form-group">
                <label>Montant Net:</label>
                <input
                  type="text"
                  className="form-control"
                  name="montant_net"
                  onChange={handleChange}
                  placeholder="Montant Net"
                  value={reglement.montant_net}
                />
              </div>
              <div className="form-group">
                <label>Observations:</label>
                <textarea
                  className="form-control"
                  name="observations"
                  onChange={handleChange}
                  placeholder="Observations"
                  value={reglement.observations}
                />
              </div>
              <h3>Payements</h3>
              {payements.map((payement, index) => (
                <div key={index} className="form-group">
                  <div className="row">
                    <div className="col-md-2">
                      <label>Modalité:</label>
                      <input
                        type="text"
                        className="form-control"
                        name="modalite"
                        onChange={(e) => handleChangePayement(e, index)}
                        value={payement.modalite}
                      />
                    </div>
                    <div className="col-md-2">
                      <label>Numéro:</label>
                      <input
                        type="text"
                        className="form-control"
                        name="num"
                        onChange={(e) => handleChangePayement(e, index)}
                        value={payement.num}
                      />
                    </div>
                    <div className="col-md-2">
                      <label>Banque:</label>
                      <input
                        type="text"
                        className="form-control"
                        name="banque"
                        onChange={(e) => handleChangePayement(e, index)}
                        value={payement.banque}
                      />
                    </div>
                    <div className="col-md-2">
                      <label>Date d'échéance:</label>
                      <input
                        type="date"
                        className="form-control"
                        name="date_echeance"
                        onChange={(e) => handleChangePayement(e, index)}
                        value={payement.date_echeance}
                      />
                    </div>
                    <div className="col-md-2">
                      <label>Montant:</label>
                      <input
                        type="text"
                        className="form-control"
                        name="montant"
                        onChange={(e) => handleChangePayement(e, index)}
                        value={payement.montant}
                      />
                    </div>
                    <div className="col-md-2 d-flex align-items-end">
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => removePayement(index, payement.id)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-primary"
                onClick={addPayement}
              >
                Ajouter un Payement
              </button>
              <h3>Pièces à Régler</h3>
              {pieces.map((piece, index) => (
                <div key={index} className="form-group">
                  <div className="row">
                    <div className="col-md-2">
                      <label>Numéro de pièce:</label>
                      <input
                        type="text"
                        className="form-control"
                        name="num_piece_a_regler"
                        onChange={(e) => handleChangePiece(e, index)}
                        value={piece.num_piece_a_regler}
                      />
                    </div>
                    <div className="col-md-2">
                      <label>Date de pièce:</label>
                      <input
                        type="date"
                        className="form-control"
                        name="date_piece_a_regler"
                        onChange={(e) => handleChangePiece(e, index)}
                        value={piece.date_piece_a_regler}
                      />
                    </div>
                    <div className="col-md-2">
                      <label>Montant de pièce:</label>
                      <input
                        type="text"
                        className="form-control"
                        name="montant_piece_a_regler"
                        onChange={(e) => handleChangePiece(e, index)}
                        value={piece.montant_piece_a_regler}
                      />
                    </div>
                    <div className="col-md-4">
                      <label>Document Fichier:</label>
                      <input
                        type="file"
                        className="form-control"
                        name="document_fichier"
                        onChange={(e) => handleChangePiece(e, index)}
                      />
                    </div>
                    <div className="col-md-2 d-flex align-items-end">
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => removePiece(index, piece.id)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="btn btn-primary"
                onClick={addPiece}
              >
                Ajouter une Pièce
              </button>
              <button type="submit" className="btn btn-success mr-2">
                Enregistrer
              </button>
              <button type="button" className="btn btn-light" onClick={handleCancel}>
                Annuler
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateReglement;
