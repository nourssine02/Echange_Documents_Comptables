import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";

const UpdateReglementRecu = ({isSidebarOpen}) => {
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
        // If no code tier is selected, reset tiers_saisie to an empty string
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

  const addFacture = () => {
    setFactures([...factures, initialFactureState]);
  };

  const removeFacture = (index) => {
    const updatedFactures = [...factures];
    updatedFactures.splice(index, 1);
    setFactures(updatedFactures);
  };

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

  const handleCancel = () => {
    navigate("/reglements_recus");
  };

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
            <h2 class>Modifier un Règlement Reçu</h2>
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
                            onClick={() =>
                              openImageViewer(facture.document_fichier)
                            }
                          >
                            View Document
                          </button>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => removeFacture(index)}
                    >
                      Supprimer
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-success btn-sm"
                  onClick={addFacture}
                >
                  Ajouter Facture
                </button>
              </div>
              <hr />
              {/* Réglement */}
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Code Tiers:</label>
                    <select
                      className="form-control form-control-lg"
                      name="code_tiers"
                      style={{ color: "black" }}
                      onChange={handleChange}
                      value={reglement.code_tiers || ""} // Ensure value is not null
                    >
                      <option value="">Code Tiers</option>
                      {codeTiers.map((codeTier) => (
                        <option
                          key={codeTier.code_tiers}
                          value={codeTier.code_tiers}
                        >
                          {codeTier.code_tiers}
                        </option>
                      ))}
                    </select>
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
                    <label>Montant Total à Régler :</label>
                    <input
                      type="number"
                      name="montant_total_a_regler"
                      value={reglement.montant_total_a_regler}
                      onChange={handleChange}
                      className="form-control form-control-lg"
                      placeholder="Montant Total à Régler"
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
                      rows={2}
                      cols={20}
                      value={reglement.observations}
                    />
                  </div>
                </div>
              </div>
              <hr />
              <div>
                <h4>Paiements</h4>
                {payements.map((payement, index) => (
                  <div className="row" key={index}>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Modalité:</label>
                        <select
                          style={{ color: "black" }}
                          value={payement.modalite}
                          name="modalite"
                          className="form-control"
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
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Numéro:</label>
                        <input
                          type="text"
                          value={payement.num}
                          name="num"
                          className="form-control"
                          onChange={(e) => handleChangePayement(e, index)}
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Banque:</label>
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
                        <label>Date d'échéance:</label>
                        <input
                          type="date"
                          value={payement.date_echeance}
                          name="date_echeance"
                          className="form-control"
                          onChange={(e) => handleChangePayement(e, index)}
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
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
                    </div>
                    <div className="col-md-3">
                      <button
                        type="button"
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
                  Ajouter Paiement
                </button>
              </div>
              <hr />

              {/* Boutons Enregistrer/Annuler */}
              <div
                className="d-flex justify-content-center"
              >
                <button
                  type="submit"
                  className="btn btn-primary mr-2"
                >
                  Modifier
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
