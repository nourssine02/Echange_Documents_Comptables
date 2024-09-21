import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";

const UpdateReglementRecu = ({ isSidebarOpen }) => {
  const { id } = useParams();
  const navigate = useNavigate();

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

  const initialFactureState = {
    num_facture: "",
    date_facture: "",
    montant_total_facture: "",
    document_fichier: "",
  };

  const [reglement, setReglement] = useState(initialReglementState);
  const [payements, setPayements] = useState([initialPayementState]);
  const [factures, setFactures] = useState([initialFactureState]);
  const [codeTiers, setCodeTiers] = useState([]);
  const [factureOptions, setFactureOptions] = useState([]);

  // Récupérer le règlement et ses détails (paiements, factures)
  useEffect(() => {
    const fetchReglement = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/reglements_recus/${id}`);
        const { data } = response;
        setReglement(data.reglement);
        setPayements(data.payements || []);
        setFactures(data.factures || []);
      } catch (error) {
        console.error("Error fetching reglement:", error);
      }
    };
    fetchReglement();
  }, [id]);

  // Récupérer les codes tiers disponibles
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

  // Récupérer les factures disponibles
  useEffect(() => {
    const fetchFactures = async () => {
      try {
        const res = await axios.get("http://localhost:5000/num_facture");
        const options = res.data.map((num_facture) => ({
          value: num_facture,
          label: num_facture,
        }));
        setFactureOptions(options);
      } catch (err) {
        console.error("Error fetching factures:", err);
      }
    };
    fetchFactures();
  }, []);

  // Gérer les changements pour les champs du règlement
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
      setReglement((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Gérer les changements pour les paiements
  const handleChangePayement = (e, index) => {
    const { name, value } = e.target;
    const updatedPayements = [...payements];
    updatedPayements[index][name] = value;
    setPayements(updatedPayements);
  };

  // Ajouter un paiement
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

  // Supprimer un paiement
  const removePayement = (index) => {
    const updatedPayements = [...payements];
    updatedPayements.splice(index, 1);
    setPayements(updatedPayements);
  };

  // Gérer les changements pour les factures
  const handleChangeFacture = async (facture, index) => {
    try {
      const res = await axios.get(`http://localhost:5000/factures/${facture.value}`);
      const { id, date_facture, montant_total_facture, document_fichier } = res.data;
      const updatedFactures = [...factures];
      updatedFactures[index] = {
        id,
        num_facture: facture.value,
        date_facture,
        montant_total_facture,
        document_fichier,
      };
      setFactures(updatedFactures);
    } catch (err) {
      console.error("Error fetching facture data:", err);
    }
  };

  // Ajouter une facture
  const addFacture = () => {
    setFactures([...factures, initialFactureState]);
  };

  // Supprimer une facture
  const removeFacture = (index) => {
    const updatedFactures = [...factures];
    updatedFactures.splice(index, 1);
    setFactures(updatedFactures);
  };

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      reglement,
      payements,
      factures,
    };
    try {
      const response = await axios.put(`http://localhost:5000/reglements_recus/${id}`, data);
      console.log(response.data.message);
      alert("Données mises à jour avec succès.");
      navigate("/reglements_recus");
    } catch (error) {
      console.error("Error updating reglement:", error);
      alert("Erreur lors de la mise à jour du règlement: " + error.message);
    }
  };

  // Annuler la modification
  const handleCancel = () => {
    navigate("/reglements_recus");
  };

  // Ouvrir un visualiseur d'image
  const openImageViewer = (documentUrl) => {
    const imageWindow = window.open("", "_blank");
    const img = document.createElement("img");
    img.src = documentUrl;
    img.style.width = "30%";
    img.style.height = "100%";
    img.style.marginLeft = "400px";
    imageWindow.document.body.appendChild(img);
  };

  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? 'shifted' : ''}`}>
        <div className="card">
          <div className="card-body">
            <h2 className="text-center">Modifier un Règlement Reçu</h2>
            <br />
            <form className="forms-sample" onSubmit={handleSubmit}>
              {/* Factures */}
              <div>
                <h4>Factures</h4>
                {factures.map((facture, index) => (
                  <div key={index} className="mb-3 border p-3">
                    <legend>Facture {index + 1}</legend>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label>N° Facture à régler:</label>
                          <Select
                            options={factureOptions}
                            onChange={(value) => handleChangeFacture(value, index)}
                            value={factureOptions.find(option => option.value === (facture.num_facture || "")) || { value: "", label: "" }}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label>Date Facture:</label>
                          <input
                            type="date"
                            className="form-control"
                            name="date_facture"
                            value={facture.date_facture || ""}
                            onChange={(e) => handleChangeFacture(e, index)}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label>Montant Total Facture:</label>
                          <input
                            type="number"
                            className="form-control"
                            name="montant_total_facture"
                            value={facture.montant_total_facture || ""}
                            onChange={(e) => handleChangeFacture(e, index)}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label>Document / Fichier à Insérer :</label>
                          <br />
                          <button
                            type="button"
                            className="btn btn-link"
                            onClick={() => openImageViewer(facture.document_fichier)}
                          >
                            Voir Document
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => removeFacture(index)}
                    >
                      Supprimer Facture
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={addFacture}
                >
                  Ajouter Facture
                </button>
              </div>

              <hr />

              {/* Règlement */}
              <div>
                <h4>Règlement</h4>
                <div className="form-group mb-3">
                  <label>Code Tiers:</label>
                  <select
                    className="form-control"
                    name="code_tiers"
                    value={reglement.code_tiers}
                    onChange={handleChange}
                  >
                    <option value="">Sélectionner le Code Tiers</option>
                    {codeTiers.map((codeTier) => (
                      <option key={codeTier.code_tiers} value={codeTier.code_tiers}>
                        {codeTier.code_tiers}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group mb-3">
                  <label>Tiers Saisie:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="tiers_saisie"
                    value={reglement.tiers_saisie}
                    onChange={handleChange}
                    readOnly
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Montant Total à Régler:</label>
                  <input
                    type="number"
                    className="form-control"
                    name="montant_total_a_regler"
                    value={reglement.montant_total_a_regler}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Observations:</label>
                  <textarea
                    className="form-control"
                    name="observations"
                    value={reglement.observations}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <hr />

              {/* Paiements */}
              <div>
                <h4>Paiements</h4>
                {payements.map((payement, index) => (
                  <div key={index} className="mb-3 border p-3">
                    <legend>Paiement {index + 1}</legend>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label>Modalité:</label>
                          <input
                            type="text"
                            className="form-control"
                            name="modalite"
                            value={payement.modalite}
                            onChange={(e) => handleChangePayement(e, index)}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group mb-3">
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
                      <div className="col-md-6">
                        <div className="form-group mb-3">
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
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label>Date d'Échéance:</label>
                          <input
                            type="date"
                            className="form-control"
                            name="date_echeance"
                            value={payement.date_echeance}
                            onChange={(e) => handleChangePayement(e, index)}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group mb-3">
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
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => removePayement(index)}
                    >
                      Supprimer Paiement
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={addPayement}
                >
                  Ajouter Paiement
                </button>
              </div>

              <br />

              <button type="submit" className="btn btn-success mr-2">
                Mettre à Jour
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

export default UpdateReglementRecu;
