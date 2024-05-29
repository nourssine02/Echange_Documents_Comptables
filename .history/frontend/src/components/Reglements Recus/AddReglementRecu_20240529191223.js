import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

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
  const [loadingFacture, setLoadingFacture] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      reglement: {
        code_tiers: reglement.code_tiers,
        tiers_saisie: reglement.tiers_saisie,
        montant_total_a_regler: reglement.montant_total_a_regler,
        observations: reglement.observations,
      },
      payements,
      factures,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/reglements_recus",
        data
      );
      console.log(response.data.message);
      // Reset des données après succès
      setReglement(initialReglementState);
      setPayements([initialPayementState]);
      setFactures([initialFactureState]);
      alert("Données ajoutées avec succès.");
      navigate("/reglements_recus");
    } catch (error) {
      console.error("Erreur lors de l'ajout du règlement :", error);
      if (error.response) {
        console.error("Contenu de la réponse :", error.response.data);
      } else {
        console.error("Aucune réponse reçue.");
      }
      alert("Erreur lors de l'ajout du règlement: " + error.message);
    }
  };

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

  const handleChangeFacture = async (facture, index) => {
    setLoadingFacture(true);
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
    } finally {
      setLoadingFacture(false);
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
      <div className="content-wrapper">
        <div className="card">
          <div className="card-body">
            <h1>Ajouter un Règlement Reçus</h1>
            <br />
            <form className="forms-sample" onSubmit={handleSubmit}>
              <br></br>

              {factures.map((facture, index) => (
                <div key={index} className="mb-3 border p-3">
                  <legend>Facture à régler {index + 1}</legend>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label>N° Facture à régler:</label>
                        <Select
                          options={factureOptions}
                          onChange={(value) =>
                            handleChangeFacture(value, index)
                          }
                          value={factureOptions.find(
                            (option) => option.value === facture.num_facture
                          )}
                        />
                      </div>
                    </div>
                    {loadingFacture ? (
                      <p>Loading facture data...</p>
                    ) : (
                      <>
                        <div className="col-md-6">
                          <div className="form-group mb-3">
                            <label>Dates Facture à régler:</label>
                            <input
                              type="date"
                              className="form-control form-control-sm"
                              name="date_facture"
                              value={facture.date_facture}
                              max={new Date().toISOString().split("T")[0]}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group mb-3">
                            <label>Montants Facture à régler:</label>
                            <input
                              type="number"
                              className="form-control form-control-sm"
                              name="montant_total_facture"
                              value={facture.montant_total_facture}
                              readOnly
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
                      </>
                    )}

                    <div className="col-md-6">
                      <div className="form-group d-flex align-items-end mb-0">
                        <button
                          onClick={() => removeFacture(index)}
                          type="button"
                          className="btn btn-danger btn-sm me-2"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                        &nbsp;
                        {index === factures.length - 1 && (
                          <button
                            onClick={addFacture}
                            type="button"
                            className="btn btn-success btn-sm"
                          >
                            <i className="bi bi-plus-circle"></i>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <br></br>
              <hr />

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
              <br></br>
              <legend>Paiements :</legend>
              {payements.map((payement, index) => (
                <div className="row" key={index}>
                    <div className="col-md-4">
                      <div className="form-group">
                        <label>Nature:</label>
                        <select
                          style={{ color: "black" }}
                          value={payement.modalite}
                          name="modalite"
                          className="form-control mr-3"
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
                      <div className="col-md-4">
                      <div className="form-group">
                        <label>Numéro:</label>
                        <input
                          type="text"
                          value={payement.num}
                          name="num"
                          className="form-control mr-3"
                          onChange={(e) => handleChangePayement(e, index)}
                        />
                      </div>
                      </div>                
                      <div className="col-md-4">
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
                      <div className="col-md-4">
                      <div className="form-group">
                        <label>Date d'échéance:</label>
                        <input
                          type="date"
                          value={payement.date_echeance}
                          name="date_echeance"
                          className="form-control mr-3"
                          onChange={(e) => handleChangePayement(e, index)}
                        />
                      </div>
                      </div>
                      <div className="col-md-4">
                      <div className="form-group">
                        <label>Montant:</label>
                        <input
                          type="number"
                          value={payement.montant}
                          name="montant"
                          className="form-control mr-3"
                          onChange={(e) => handleChangePayement(e, index)}
                        />
                      </div>
                      </div>
                      <br></br>
                     
                        <div className="col-md-4" style={{marginTop: "40px"}}>
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
