import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";

const UpdateReglementRecu = ({ isSidebarOpen }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  // States initiaux
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

  // Fetch des données de règlement
  useEffect(() => {
    const fetchReglement = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/reglements_recus/${id}`
        );
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

  // Fetch des codes tiers
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

  // Fetch des factures
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

  // Gestion des changements dans le formulaire de règlement
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
        // Réinitialiser si aucun code tiers sélectionné
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

  // Gestion des changements dans les paiements
  const handleChangePayement = (e, index) => {
    const { name, value } = e.target;
    const updatedPayements = [...payements];
    updatedPayements[index][name] = value;
    setPayements(updatedPayements);
  };

  // Ajouter un paiement
  const addPayement = () => {
    setPayements([...payements, initialPayementState]);
  };

  // Supprimer un paiement
  const removePayement = (index) => {
    const updatedPayements = [...payements];
    updatedPayements.splice(index, 1);
    setPayements(updatedPayements);
  };

  // Gestion des changements dans les factures
  const handleChangeFacture = async (facture, index) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/factures/${facture.value}`
      );
      const { id, date_facture, montant_total_facture, document_fichier } =
        res.data;
      const updatedFactures = [...factures];
      updatedFactures[index] = {
        id: id,
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

  // Soumettre les modifications
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      reglement,
      payements,
      factures,
    };

    try {
      const response = await axios.put(
        `http://localhost:5000/reglements_recus/${id}`,
        data
      );
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

  // Ouvrir l'image dans un visualiseur
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
              {/* Formulaire de factures */}
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
                            onChange={(value) =>
                              handleChangeFacture(value, index)
                            }
                            value={
                              factureOptions.find(
                                (option) =>
                                  option.value === (facture.num_facture || "")
                              ) || { value: "", label: "" }
                            }
                          />
                        </div>
                      </div>
                      {/* Champ "Date Facture" */}
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label>Date Facture:</label>
                          <input
                            type="date"
                            className="form-control"
                            name="date_facture"
                            value={facture.date_facture || ""}
                            disabled
                          />
                        </div>
                      </div>
                      {/* Champ "Montant Total Facture" */}
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label>Montant Total Facture:</label>
                          <input
                            type="number"
                            className="form-control"
                            name="montant_total_facture"
                            value={facture.montant_total_facture || ""}
                            disabled
                          />
                        </div>
                      </div>
                      {/* Affichage du document associé */}
                      <div className="col-md-6">
                        <div className="form-group mb-3">
                          <label>Document associé:</label>
                          {facture.document_fichier && (
                            <div>
                              <button
                                className="btn btn-outline-primary btn-icon-text"
                                type="button"
                                onClick={() =>
                                  openImageViewer(facture.document_fichier)
                                }
                              >
                                <i className="ti ti-eye btn-icon-prepend"></i>
                                Afficher le document
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Bouton de suppression de facture */}
                      <div className="col-md-12 text-end">
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => removeFacture(index)}
                        >
                          Supprimer cette facture
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Bouton pour ajouter une facture */}
                <div className="text-center">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={addFacture}
                  >
                    Ajouter une facture
                  </button>
                </div>
              </div>
              <br />
              {/* Autres sections similaires pour les paiements et les informations générales */}
              {/* Bouton de soumission du formulaire */}
              <div className="text-center">
                <button type="submit" className="btn btn-success">
                  Enregistrer les modifications
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

export default UpdateReglementRecu;
