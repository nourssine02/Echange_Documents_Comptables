import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";

const UpdateFacture = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const initialFactureState = {
    date_facture: "",
    num_facture: "",
    code_tiers: "",
    tiers_saisie: "",
    reference_livraison: "",
    montant_HT_facture: "",
    FODEC_sur_facture: "",
    TVA_facture: "",
    timbre_facture: "",
    autre_montant_facture: "",
    montant_total_facture: "",
    observations: "",
    document_fichier: "",
    etat_payement: false,  // Ajout de l'état de paiement
  };

  const initialFamilleState = {
    famille: "",
    sous_famille: "",
    article: "",
    quantite: 0,
  };

  const [facture, setFacture] = useState(initialFactureState);
  const [familles, setFamilles] = useState([initialFamilleState]);

  const [options, setOptions] = useState([]);
  const [codeTiers, setCodeTiers] = useState([]);
  const [refLivraisons, setRefLivraisons] = useState([]);

  useEffect(() => {
    const fetchFactureDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/facture/${id}`);
        const { data } = response;
        setFacture(data.facture);
        setFamilles(data.familles || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des détails de la facture :", error);
      }
    };
    fetchFactureDetails();
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
    const fetchRefLivraison = async () => {
      try {
        const res = await axios.get("http://localhost:5000/reference_livraison");
        setRefLivraisons(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchRefLivraison();
  }, []);

  useEffect(() => {
    const fetchFamilles = async () => {
      try {
        const res = await axios.get("http://localhost:5000/familles");
        const options = res.data.map((famille) => ({
          value: famille.famille,
          label: famille.famille,
        }));
        setOptions(options);
      } catch (err) {
        console.log(err);
      }
    };
    fetchFamilles();
  }, []);

  const handleChange = (e) => {
    const { name, files, type, checked } = e.target;

    if (name === "document_fichier" && files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result.split(",")[1];
        const url = `data:image/png;base64,${base64Data}`;
        setFacture((prev) => ({ ...prev, document_fichier: url }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      const value = type === "checkbox" ? checked : e.target.value;
      setFacture((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedFamilles = familles.map((famille) => ({
        famille: famille.famille,
        sous_famille: famille.sous_famille,
        article: famille.article,
        quantite: famille.quantite,
        commande_id: id,
      }));

      await axios.put(`http://localhost:5000/facture/${id}`, {
        facture,
        familles: formattedFamilles,
      });
      alert("Facture mise à jour avec succès.");
      navigate("/facturations");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la facture :", error);
      alert("Erreur lors de la mise à jour de la facture.");
    }
  };

  const handleCancel = () => {
    navigate("/facturations");
  };

  const openImageViewer = () => {
    const imageViewerUrl = facture.document_fichier;
    const imageWindow = window.open("", "_blank");
    const img = document.createElement("img");
    img.src = imageViewerUrl;
    img.style.marginLeft = "400px";
    imageWindow.document.body.appendChild(img);
  };

  const handleChangeFamille = async (famille, index) => {
    try {
      const res = await axios.get(`http://localhost:5000/familles/${famille.value}`);
      const { sous_famille, article, quantite } = res.data;

      const updatedFamilles = [...familles];
      updatedFamilles[index] = { ...familles[index], famille: famille.value, sous_famille, article, quantite };

      setFamilles(updatedFamilles);
    } catch (err) {
      console.log("Error fetching familles data:", err);
    }
  };

  const addFamille = () => {
    setFamilles([
      ...familles,
      {
        famille: "",
        sous_famille: "",
        article: "",
        quantite: 0,
      },
    ]);
  };

  const removeFamille = (index) => {
    const updatedFamilles = familles.filter((_, idx) => idx !== index);
    setFamilles(updatedFamilles);
  };

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <div className="card">
          <div className="card-body">
            <h1>Modifier une Facture</h1>
            <br />
            <form className="forms-sample" onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <label>Date de la Facture:</label>
                    <input
                      type="date"
                      className="form-control"
                      name="date_facture"
                      onChange={handleChange}
                      value={facture.date_facture}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label>N° de la Facture:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="num_facture"
                      onChange={handleChange}
                      value={facture.num_facture}
                    />
                  </div>

                  <div className="form-group">
                    <label>Référence de la Livraison:</label>
                    <select
                      style={{ color: "black" }}
                      className="form-control form-control-lg"
                      name="reference_livraison"
                      onChange={handleChange}
                      value={facture.reference_livraison}
                    >
                      <option value="" style={{ color: "black" }}>
                        Référence Livraison
                      </option>
                      {refLivraisons.map((refLivraison) => (
                        <option
                          key={refLivraison.num_BL}
                          value={refLivraison.num_BL}
                          style={{ color: "black" }}
                        >
                          {refLivraison.num_BL}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label>Code Tiers:</label>
                    <select
                      style={{ color: "black" }}
                      className="form-control form-control-lg"
                      name="code_tiers"
                      onChange={handleChange}
                      value={facture.code_tiers}
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
                    <label>Tiers à Saisir:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="tiers_saisie"
                      onChange={handleChange}
                      value={facture.tiers_saisie}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label>Montant HT de la Facture:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="montant_HT_facture"
                      onChange={handleChange}
                      value={facture.montant_HT_facture}
                    />
                  </div>

                  <div className="form-group">
                    <label>FODEC sur la Facture:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="FODEC_sur_facture"
                      onChange={handleChange}
                      value={facture.FODEC_sur_facture}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label>TVA de la Facture:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="TVA_facture"
                      onChange={handleChange}
                      value={facture.TVA_facture}
                    />
                  </div>

                  <div className="form-group">
                    <label>Timbre sur la Facture:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="timbre_facture"
                      onChange={handleChange}
                      value={facture.timbre_facture}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label>Autre montant sur la Facture:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="autre_montant_facture"
                      onChange={handleChange}
                      value={facture.autre_montant_facture}
                    />
                  </div>

                  <div className="form-group">
                    <label>Montant Total de la Facture:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="montant_total_facture"
                      onChange={handleChange}
                      value={facture.montant_total_facture}
                    />
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="form-group">
                    <label>Observations:</label>
                    <textarea
                      className="form-control"
                      name="observations"
                      value={facture.observations}
                      onChange={handleChange}
                      rows={5}
                      cols={50}
                    />
                  </div>

                  <div className="form-group">
                    <label>Document / Fichier à Insérer :</label>
                    <div className="col-md-6">
                      <input
                        type="file"
                        className="form-control"
                        name="document_fichier"
                        onChange={handleChange}
                      />
                    </div>
                    <br />
                    {facture.document_fichier && (
                      <img
                        src={facture.document_fichier}
                        alt="Facture Document"
                        style={{
                          width: "100px",
                          height: "auto",
                          cursor: "pointer",
                        }}
                        onClick={openImageViewer}
                      />
                    )}
                  </div>

                  <div className="form-group">
                    <label>État de paiement: </label>
                    <input
                      type="checkbox"
                      name="etat_payement"
                      checked={facture.etat_payement}
                      onChange={handleChange}
                    />
                    <span style={{ marginLeft: "10px",
                       color: facture.etat_payement ? "green" : "red",
                       fontWeight: "bold",
                     }}>
                      {facture.etat_payement ? "Payée" : "Non Payée"}
                    </span>
                  </div>
                </div>
              </div>

              <br />
              <br />
              <hr />
              <legend>Familles</legend>
              {familles.map((famille, index) => (
                <div key={index} className="mb-3 border p-3">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label>Famille:</label>
                        <Select
                          options={options}
                          onChange={(value) => handleChangeFamille(value, index)}
                          value={options.find(
                            (option) => option.value === famille.famille
                          )}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label>Sous Famille:</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          name="sous_famille"
                          value={famille.sous_famille}
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label>Article:</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          name="article"
                          value={famille.article}
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label>Quantité:</label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          name="quantite"
                          value={famille.quantite}
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group d-flex align-items-end mb-0">
                        <button
                          onClick={() => removeFamille(index)}
                          type="button"
                          className="btn btn-danger btn-sm me-2"
                        >
                          <i className="bi bi-trash"></i> Supprimer
                        </button>
                        &nbsp;
                        {index === familles.length - 1 && (
                          <button
                            onClick={addFamille}
                            type="button"
                            className="btn btn-success btn-sm"
                          >
                            <i className="bi bi-plus-circle"></i> Ajouter
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <br />
              <div
                className="button d-flex align-items-center"
                style={{ gap: "10px", marginLeft: "300px" }}
              >
                <button
                  type="submit"
                  className="btn btn-primary mr-2"
                  style={{ marginBottom: "5px" }}
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

export default UpdateFacture;
