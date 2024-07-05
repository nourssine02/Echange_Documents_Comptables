import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UpdateAchat = ({ isSidebarOpen }) => {
  const { id } = useParams();

  const [achat, setAchat] = useState({
    date_saisie: "",
    code_tiers: "",
    tiers_saisie: "",
    type_piece: "",
    num_piece: "",
    date_piece: "",
    statut: "",
    montant_HT_piece: "",
    FODEC_piece: "",
    TVA_piece: "",
    timbre_piece: "",
    autre_montant_piece: "",
    montant_total_piece: "",
    observations: "",
    document_fichier: "",
  });

  const [codeTiers, setCodeTiers] = useState([]);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [errors, setErrors] = useState({});

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

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "document_fichier" && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAchat((prev) => ({ ...prev, document_fichier: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      setAchat((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!achat.date_saisie) newErrors.date_saisie = "Date de saisie est requise.";
    if (!achat.code_tiers) newErrors.code_tiers = "Code tiers est requis.";
    if (!achat.num_piece) newErrors.num_piece = "Numéro de la pièce est requis.";
    if (!achat.type_piece) newErrors.type_piece = "Type de la pièce est requis.";
    if (!achat.montant_HT_piece) newErrors.montant_HT_piece = "Montant HT est requis.";
    if (!achat.FODEC_piece) newErrors.FODEC_piece = "FODEC est requis.";
    if (!achat.TVA_piece) newErrors.TVA_piece = "TVA est requise.";
    if (!achat.timbre_piece) newErrors.timbre_piece = "Timbre est requis.";
    if (!achat.montant_total_piece) newErrors.montant_total_piece = "Montant total est requis.";
    if (!achat.document_fichier) newErrors.document_fichier = "Document fichier est requis.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setAlert({ type: "danger", message: "Veuillez remplir tous les champs requis." });
      return;
    }
    try {
      await axios.put(`http://localhost:5000/achats/${id}`, achat);
      setAlert({ type: "success", message: "Achat mis à jour avec succès." });
      navigate("/achats");
    } catch (err) {
      console.log(err);
      setAlert({ type: "danger", message: "Une erreur est survenue lors de la mise à jour de l'achat." });
    }
  };

  useEffect(() => {
    const fetchAchat = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/achats/${id}`);
        const data = res.data[0];
        setAchat({
          date_saisie: data.date_saisie ? data.date_saisie.split('T')[0] : "",
          code_tiers: data.code_tiers,
          tiers_saisie: data.tiers_saisie,
          type_piece: data.type_piece,
          num_piece: data.num_piece,
          date_piece: data.date_piece ? data.date_piece.split('T')[0] : "",
          statut: data.statut,
          montant_HT_piece: data.montant_HT_piece,
          FODEC_piece: data.FODEC_piece,
          TVA_piece: data.TVA_piece,
          timbre_piece: data.timbre_piece,
          autre_montant_piece: data.autre_montant_piece,
          montant_total_piece: data.montant_total_piece,
          observations: data.observations,
          document_fichier: data.document_fichier,
        });
      } catch (err) {
        console.log(err);
      }
    };
    fetchAchat();
  }, [id]);

  const handleCancel = () => {
    navigate("/achats");
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
      <div className={`content-wrapper ${isSidebarOpen ? "shifted" : ""}`}>
        <div className="card">
          <div className="card-body">
            <h1 className="text-center">Modifier un Achat</h1>
            <br />
            {alert.message && (
              <div className={`alert alert-${alert.type} text-center`}>
                {alert.message}
              </div>
            )}
            <form className="forms-sample">
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Date de Saisie:</label>
                    <input
                      type="date"
                      className={`form-control ${errors.date_saisie && "is-invalid"}`}
                      name="date_saisie"
                      onChange={handleChange}
                      value={achat.date_saisie}
                    />
                    {errors.date_saisie && (
                      <div className="invalid-feedback">
                        {errors.date_saisie}
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Date de la Pièce:</label>
                    <input
                      type="date"
                      className={`form-control ${errors.date_piece && "is-invalid"}`}
                      name="date_piece"
                      onChange={handleChange}
                      value={achat.date_piece}
                    />
                    {errors.date_piece && (
                      <div className="invalid-feedback">
                        {errors.date_piece}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Code Tiers:</label>
                    <select
                      style={{ color: "black" }}
                      className={`form-control ${errors.code_tiers && "is-invalid"}`}
                      name="code_tiers"
                      onChange={handleChange}
                      value={achat.code_tiers}
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
                    {errors.code_tiers && (
                      <div className="invalid-feedback">
                        {errors.code_tiers}
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>N° de la Pièce :</label>
                    <input
                      type="text"
                      className={`form-control ${errors.num_piece && "is-invalid"}`}
                      name="num_piece"
                      onChange={handleChange}
                      value={achat.num_piece}
                    />
                    {errors.num_piece && (
                      <div className="invalid-feedback">
                        {errors.num_piece}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Tiers à Saisir:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="tiers_saisie"
                      onChange={handleChange}
                      value={achat.tiers_saisie}
                    />
                  </div>
                  <div className="form-group">
                    <label>Type de la Pièce :</label>
                    <select
                      style={{ color: "black" }}
                      className={`form-control ${errors.type_piece && "is-invalid"}`}
                      name="type_piece"
                      onChange={handleChange}
                      value={achat.type_piece}
                    >
                      <option value="">Sélectionnez...</option>
                      <option value="facture">Facture</option>
                      <option value="note d'honoraire">Note d'honoraire</option>
                      <option value="bon de livraison">Bon de livraison</option>
                      <option value="quittance">Quittance</option>
                      <option value="reçu">Reçu</option>
                      <option value="contrat">Contrat</option>
                      <option value="autre">Autre</option>
                    </select>
                    {errors.type_piece && (
                      <div className="invalid-feedback">
                        {errors.type_piece}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Statut :</label>
                    <select
                      style={{ color: "black" }}
                      className="form-control"
                      name="statut"
                      onChange={handleChange}
                      value={achat.statut}
                    >
                      <option value="">Sélectionnez...</option>
                      <option value="réglée en espèces">
                        Réglée en espèces
                      </option>
                      <option value="réglée">Réglée</option>
                      <option value="non réglée">Non Réglée</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>FODEC sur la Pièce:</label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="text"
                        className={`form-control ${errors.FODEC_piece && "is-invalid"}`}
                        name="FODEC_piece"
                        onChange={handleChange}
                        value={achat.FODEC_piece}
                      />
                      &nbsp;
                      <span>DT</span>
                    </div>
                    {errors.FODEC_piece && (
                      <div className="invalid-feedback">
                        {errors.FODEC_piece}
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Montant Total de la Pièce:</label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="text"
                        className={`form-control ${errors.montant_total_piece && "is-invalid"}`}
                        name="montant_total_piece"
                        onChange={handleChange}
                        value={achat.montant_total_piece}
                      />
                      &nbsp;
                      <span>DT</span>
                    </div>
                    {errors.montant_total_piece && (
                      <div className="invalid-feedback">
                        {errors.montant_total_piece}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Montant HT de la Pièce:</label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="text"
                        className={`form-control ${errors.montant_HT_piece && "is-invalid"}`}
                        name="montant_HT_piece"
                        onChange={handleChange}
                        value={achat.montant_HT_piece}
                      />
                      &nbsp;
                      <span>DT</span>
                    </div>
                    {errors.montant_HT_piece && (
                      <div className="invalid-feedback">
                        {errors.montant_HT_piece}
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Timbre sur la Pièce:</label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="text"
                        className={`form-control ${errors.timbre_piece && "is-invalid"}`}
                        name="timbre_piece"
                        onChange={handleChange}
                        value={achat.timbre_piece}
                      />
                      &nbsp;
                      <span>DT</span>
                    </div>
                    {errors.timbre_piece && (
                      <div className="invalid-feedback">
                        {errors.timbre_piece}
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Document / Fichier à Insérer :</label>
                    <input
                      type="file"
                      className={`form-control ${errors.document_fichier && "is-invalid"}`}
                      name="document_fichier"
                      onChange={handleChange}
                      placeholder="Pièce Justificative"
                      accept="image/*"
                    />
                    {errors.document_fichier && (
                      <div className="invalid-feedback">
                        {errors.document_fichier}
                      </div>
                    )}
                    <br />
                    {achat.document_fichier && (
                      <img
                        src={achat.document_fichier}
                        alt="Facture Document"
                        style={{
                          width: "100px",
                          height: "auto",
                          cursor: "pointer",
                        }}
                        onClick={() => openImageViewer(achat.document_fichier)}
                      />
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>TVA sur la Pièce:</label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="text"
                        className={`form-control ${errors.TVA_piece && "is-invalid"}`}
                        name="TVA_piece"
                        onChange={handleChange}
                        value={achat.TVA_piece}
                      />
                      &nbsp;
                      <span>DT</span>
                    </div>
                    {errors.TVA_piece && (
                      <div className="invalid-feedback">
                        {errors.TVA_piece}
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Autres Montants sur la Pièce:</label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="text"
                        className={`form-control ${errors.autre_montant_piece && "is-invalid"}`}
                        name="autre_montant_piece"
                        onChange={handleChange}
                        value={achat.autre_montant_piece}
                      />
                      &nbsp;
                      <span>DT</span>
                    </div>
                    {errors.autre_montant_piece && (
                      <div className="invalid-feedback">
                        {errors.autre_montant_piece}
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Observations:</label>
                    <textarea
                      className="form-control"
                      name="observations"
                      onChange={handleChange}
                      value={achat.observations}
                    />
                  </div>
                </div>
              </div>
              <br />
              <div className="d-flex justify-content-center">
                <button className="btn btn-primary mr-2" onClick={handleClick}>
                  Modifier
                </button>
                <button className="btn btn-light" onClick={handleCancel}>
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

export default UpdateAchat;
