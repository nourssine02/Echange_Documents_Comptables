import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const AddFacture = () => {
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
  };

  const initialFamilleState = {
    famille: "",
    sous_famille: "",
    article: "",
    quantite: 0,
    prix: 0,
  };

  const [facture, setFacture] = useState(initialFactureState);
  const [familles, setFamilles] = useState([initialFamilleState]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { facture, familles };

    axios
      .post("http://localhost:5000/facture", data)
      .then((response) => {
        console.log(response.data.message);
        setFacture(initialFactureState);
        setFamilles([initialFamilleState]);
        alert("Données ajoutées avec succès.");
        navigate("/facturations");
      })
      .catch((error) => {
        console.error("Erreur lors de l'ajout du Facture :", error);
        if (error.response) {
          console.error("Contenu de la réponse :", error.response.data);
        } else {
          console.error("Aucune réponse reçue.");
        }
        alert("Erreur lors de l'ajout du Facture: " + error.message);
      });
  };

  const [codeTiers, setCodeTiers] = useState([]);
  const [options, setOptions] = useState([]);

  const navigate = useNavigate();

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
      const selectedCodeTier = codeTiers.find((codeTier) => codeTier.code_tiers === value);
      if (selectedCodeTier) {
        setFacture((prev) => ({
          ...prev,
          code_tiers: selectedCodeTier.code_tiers, 
          tiers_saisie: selectedCodeTier.identite // Mettre à jour le champ tiers_saisie avec l'identité correspondante
        }));
      } else {
        // If no code tier is selected, reset tiers_saisie to an empty string
        setFacture((prev) => ({
          ...prev,
          code_tiers: "",
          tiers_saisie: "",
        }));
      }
    } else if (name === "document_fichier" && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result.split(",")[1];
        const url = `data:image/png;base64,${base64Data}`;
        setFacture((prev) => ({ ...prev, document_fichier: url }));
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setFacture((prev) => ({ ...prev, [name]: value }));
    }
  };
  
  const handleChangeFamille = async (famille, index) => {
    const updatedFamilles = [...familles];
    updatedFamilles[index].famille = famille.value; // Mettez à jour la valeur de la famille sélectionnée
    setFamilles(updatedFamilles);
    try {
      const res = await axios.get(
        `http://localhost:5000/familles/${famille.value}`
      );
      const { sous_famille, article, quantite } = res.data;
      const updatedFamillesWithValues = [...familles];
      updatedFamillesWithValues[index] = {
        ...updatedFamillesWithValues[index],
        sous_famille,
        article,
        quantite,
        prix,
      };
      setFamilles(updatedFamillesWithValues);
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
    const updatedFamilles = [...familles];
    updatedFamilles.splice(index, 1);
    setFamilles(updatedFamilles);
  };

  const handleCancel = () => {
    navigate("/facturations");
  };

  const [refLivraisons, setRefLivraisons] = useState([]);

  useEffect(() => {
    const fetchRefLivraison = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/reference_livraison"
        );
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
          value: famille,
          label: famille,
        }));
        setOptions(options);
      } catch (err) {
        console.log(err);
      }
    };
    fetchFamilles();
  }, []);

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <div className="card">
          <div className="card-body">
            <h1>Ajouter une Facture</h1>
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
                      placeholder="N° de la Facture"
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
                      placeholder="Montant HT de la Facture"
                    />
                  </div>

                  <div className="form-group">
                    <label>FODEC sur la Facture:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="FODEC_sur_facture"
                      onChange={handleChange}
                      placeholder="FODEC sur la Facture"
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
                      placeholder="TVA de la Facture"
                    />
                  </div>

                  <div className="form-group">
                    <label>Timbre sur la Facture:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="timbre_facture"
                      onChange={handleChange}
                      placeholder="Timbre sur la Facture"
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
                      placeholder="Autre montant sur la Facture"
                    />
                  </div>
                  <div className="form-group">
                    <label>Document / Fichier à Insérer :</label>
                    <input
                      type="file"
                      className="form-control"
                      name="document_fichier"
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label>Montant Total de la Facture:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="montant_total_facture"
                      onChange={handleChange}
                      placeholder="Montant Total de la Facture"
                    />
                  </div>
                  <div className="form-group">
                    <label>Observations:</label>
                    <textarea
                      className="form-control"
                      name="observations"
                      onChange={handleChange}
                      placeholder="Entrez vos observations ici..."
                      rows={5}
                      cols={50}
                    />
                  </div>
                </div>
              </div>

              <br></br>
              <br></br>
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
                          onChange={(value) =>
                            handleChangeFamille(value, index)
                          }
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

export default AddFacture;
