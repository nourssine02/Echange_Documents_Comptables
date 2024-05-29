import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import "./AddReglement.css";

function Test({ factures, setFactures, factureOptions, handleChangeFacture, loadingFacture, addFacture, removeFacture, reglement, codeTiers, handleChange, payements, handleChangePayement, addPayement, removePayement }) {
  const [activeTab, setActiveTab] = useState('facture');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'facture':
        return (
          <Facture
            factures={factures}
            setFactures={setFactures}
            factureOptions={factureOptions}
            handleChangeFacture={handleChangeFacture}
            loadingFacture={loadingFacture}
            addFacture={addFacture}
            removeFacture={removeFacture}
          />
        );
      case 'informations':
        return (
          <AutresInformations
            reglement={reglement}
            codeTiers={codeTiers}
            handleChange={handleChange}
          />
        );
      case 'paiements':
        return (
          <Paiements
            payements={payements}
            handleChangePayement={handleChangePayement}
            addPayement={addPayement}
            removePayement={removePayement}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <div className="tabs">
        <button onClick={() => setActiveTab('facture')}>Facture</button>
        <button onClick={() => setActiveTab('informations')}>Autres Informations</button>
        <button onClick={() => setActiveTab('paiements')}>Paiements</button>
      </div>
      <div className="tab-content">
        {renderTabContent()}
      </div>
    </div>
  );
}

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

const openImageViewer = (documentUrl) => {
  const imageWindow = window.open("", "_blank");
  const img = document.createElement("img");
  img.src = documentUrl;
  img.style.width = "30%";
  img.style.height = "100%";
  img.style.marginLeft = "400px";
  imageWindow.document.body.appendChild(img);
};

const Facture = ({ factures = [], setFactures, factureOptions, handleChangeFacture, loadingFacture, addFacture, removeFacture }) => (
  <>
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
                value={factureOptions.find(option => option.value === facture.num_facture)}
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
  </>
);

const AutresInformations = ({ reglement, codeTiers, handleChange }) => (
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
          <option value="" style={{ color: "black" }}>Code Tiers</option>
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
);

const Paiements = ({ payements, handleChangePayement, addPayement, removePayement }) => (
  <>
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
              <option value="Retrait de fonds">Retrait de fonds</option>
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
              <option value="Banques locales">Banques locales</option>
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
        <div className="col-md-4 d-flex align-items-end">
          <button
            onClick={() => removePayement(index)}
            type="button"
            className="btn btn-danger btn-sm me-2"
          >
            <i className="bi bi-trash"></i>
          </button>
          {index === payements.length - 1 && (
            <button
              onClick={addPayement}
              type="button"
              className="btn btn-success btn-sm"
            >
              <i className="bi bi-plus-circle"></i>
            </button>
          )}
        </div>
      </div>
    ))}
  </>
);

function AddReglementRecu() {
  const [reglement, setReglement] = useState(initialReglementState);
  const [factures, setFactures] = useState([initialFactureState]);
  const [payements, setPayements] = useState([initialPayementState]);
  const [factureOptions, setFactureOptions] = useState([]);
  const [codeTiers, setCodeTiers] = useState([]);
  const [loadingFacture, setLoadingFacture] = useState(false);
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate("/reg");
  };

  useEffect(() => {
    fetchFactureOptions();
    fetchCodeTiers();
  }, []);

  const fetchFactureOptions = async () => {
    try {
      const response = await axios.get("/factures");
      const options = response.data.map((facture) => ({
        value: facture.num_facture,
        label: facture.num_facture,
      }));
      setFactureOptions(options);
    } catch (error) {
      console.error("Error fetching facture options:", error);
    }
  };

  const fetchCodeTiers = async () => {
    try {
      const response = await axios.get("/codes_tiers");
      setCodeTiers(response.data);
    } catch (error) {
      console.error("Error fetching code tiers:", error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setReglement((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleChangeFacture = async (selectedOption, index) => {
    const newFactures = [...factures];
    newFactures[index].num_facture = selectedOption.value;

    setLoadingFacture(true);

    try {
      const response = await axios.get(`/factures/${selectedOption.value}`);
      const { date_facture, montant_total_facture, document_fichier } = response.data;
      newFactures[index].date_facture = date_facture;
      newFactures[index].montant_total_facture = montant_total_facture;
      newFactures[index].document_fichier = document_fichier;
    } catch (error) {
      console.error("Error fetching facture data:", error);
    }

    setLoadingFacture(false);
    setFactures(newFactures);
  };

  const addFacture = () => {
    setFactures([...factures, initialFactureState]);
  };

  const removeFacture = (index) => {
    const newFactures = [...factures];
    newFactures.splice(index, 1);
    setFactures(newFactures);
  };

  const handleChangePayement = (event, index) => {
    const { name, value } = event.target;
    const newPayements = [...payements];
    newPayements[index][name] = value;
    setPayements(newPayements);
  };

  const addPayement = () => {
    setPayements([...payements, initialPayementState]);
  };

  const removePayement = (index) => {
    const newPayements = [...payements];
    newPayements.splice(index, 1);
    setPayements(newPayements);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post("/reglements_recu", {
        reglement,
        factures,
        payements,
      });
      navigate("/reglements_recu");
    } catch (error) {
      console.error("Error creating reglement recu:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-4">
      <Test 
        factures={factures}
        setFactures={setFactures}
        factureOptions={factureOptions}
        handleChangeFacture={handleChangeFacture}
        loadingFacture={loadingFacture}
        addFacture={addFacture}
        removeFacture={removeFacture}
        reglement={reglement}
        codeTiers={codeTiers}
        handleChange={handleChange}
        payements={payements}
        handleChangePayement={handleChangePayement}
        addPayement={addPayement}
        removePayement={removePayement}
      />
      <button type="submit" className="btn btn-primary mt-3">Submit</button>
      &nbsp;&nbsp;
              <button
                type="button"
                className="btn btn-light"
                onClick={handleCancel}
              >
                Annuler
              </button>
    </form>
  );
}

export default AddReglementRecu;
