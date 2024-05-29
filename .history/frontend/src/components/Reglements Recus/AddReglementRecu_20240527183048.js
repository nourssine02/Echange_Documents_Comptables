import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

function AddReglementRecu() {
  const [activeTab, setActiveTab] = useState('facture');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'facture':
        return <LignesDeFacture />;
      case 'informations':
        return <Autres_informations />;
      case 'paiements':
        return <Paiements />;
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <div className="tabs">
        <button onClick={() => setActiveTab('facture')}>Lignes de facture</button>
        <button onClick={() => setActiveTab('informations')}>Autres Informations</button>
        <button onClick={() => setActiveTab('paiements')}>Paiements</button>
      </div>
      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
}

function LignesDeFacture() {
  const initialFactureState = {
    num_facture: "",
    date_facture: "",
    montant_total_facture: "",
    document_fichier: "",
  };

  const [factures, setFactures] = useState([initialFactureState]);
  const [factureOptions, setFactureOptions] = useState([]);
  const [loadingFacture, setLoadingFacture] = useState(false);

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

  const handleChangeFacture = async (facture, index) => {
    setLoadingFacture(true);
    try {
      const res = await axios.get(`http://localhost:5000/factures/${facture.value}`);
      const { id, date_facture, montant_total_facture, document_fichier } = res.data;
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
    <div>
      <h2>Lignes de facture</h2>
      {factures.map((facture, index) => (
        <div key={index} className="mb-3 border p-3">
          <legend>Facture à régler {index + 1}</legend>

          <div className="row">
            <div className="col-md-6">
              <div className="form-group mb-3">
                <label>N° Facture à régler:</label>
                <Select
                  options={factureOptions}
                  onChange={(value) => handleChangeFacture(value, index)}
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
                      onClick={() => openImageViewer(facture.document_fichier)}
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
    </div>
  );
}

function Autres_informations() {
  const initialReglementState = {
    code_tiers: "",
    tiers_saisie: "",
    montant_total_a_regler: "",
    observations: "",
  };

  const [reglement, setReglement] = useState(initialReglementState);
  const [codeTiers, setCodeTiers] = useState([]);

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

  return (
    <div>
      <h2>Autres Informations</h2>
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
            <label>Montant Total à Régler:</label>
            <input
              type="number"
              className="form-control"
              name="montant_total_a_regler"
              onChange={handleChange}
              value={reglement.montant_total_a_regler}
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
              value={reglement.observations}
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
}

function Paiements() {
  const [formValues, setFormValues] = useState([{
    mode_paiement: '',
    montant_regle: ''
  }]);

  const handleChangePaiement = (index, event) => {
    const { name, value } = event.target;
    const newFormValues = [...formValues];
    newFormValues[index][name] = value;
    setFormValues(newFormValues);
  };

  const addFormFields = () => {
    setFormValues([...formValues, { mode_paiement: '', montant_regle: '' }]);
  };

  const removeFormFields = (index) => {
    const newFormValues = [...formValues];
    newFormValues.splice(index, 1);
    setFormValues(newFormValues);
  };

  return (
    <div>
      <h2>Paiements</h2>
      {formValues.map((element, index) => (
        <div className="form-inline" key={index}>
          <label>Mode de Paiement:</label>
          <input
            type="text"
            name="mode_paiement"
            value={element.mode_paiement || ""}
            onChange={(e) => handleChangePaiement(index, e)}
          />
          <label>Montant Réglé:</label>
          <input
            type="text"
            name="montant_regle"
            value={element.montant_regle || ""}
            onChange={(e) => handleChangePaiement(index, e)}
          />
          {index ? 
            <button type="button"  className="button remove" onClick={() => removeFormFields(index)}>Remove</button> 
            : null}
        </div>
      ))}
      <div className="button-section">
        <button className="button add" type="button" onClick={() => addFormFields()}>Add</button>
      </div>
    </div>
  );
}

export default AddReglementRecu;
