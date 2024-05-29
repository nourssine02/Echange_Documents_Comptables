import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const AddCommande = () => {
  const initialCommandeState = {
    date_commande: "",
    num_commande: "",
    code_tiers: "",
    tiers_saisie: "",
    montant_commande: "",
    date_livraison_prevue: "",
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

  const [commande, setCommande] = useState(initialCommandeState);
  const [familles, setFamilles] = useState([initialFamilleState]);
  const [options, setOptions] = useState([]);
  const [codeTiers, setCodeTiers] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { commande, familles };

    axios
      .post("http://localhost:5000/commande", data)
      .then((response) => {
        console.log(response.data.message);
        setCommande(initialCommandeState);
        setFamilles([initialFamilleState]);
        alert("Données ajoutées avec succès.");
        navigate("/commandes");
      })
      .catch((error) => {
        console.error("Erreur lors de l'ajout du commande :", error);
        if (error.response) {
          console.error("Contenu de la réponse :", error.response.data);
        } else {
          console.error("Aucune réponse reçue.");
        }
        alert("Erreur lors de l'ajout du commande: " + error.message);
      });
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "code_tiers") {
      const selectedCodeTier = codeTiers.find(
        (codeTier) => codeTier.code_tiers === value
      );
      if (selectedCodeTier) {
        setCommande((prev) => ({
          ...prev,
          code_tiers: selectedCodeTier.code_tiers,
          tiers_saisie: selectedCodeTier.identite,
        }));
      } else {
        setCommande((prev) => ({
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
        setCommande((prev) => ({ ...prev, document_fichier: url }));
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setCommande((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleChangeFamille = (value, index, field) => {
    const updatedFamilles = [...familles];
    if (field) {
      updatedFamilles[index][field] = value.target ? value.target.value : value.value;
    } else {
      updatedFamilles[index].famille = value.value;

      axios
        .get(`http://localhost:5000/familles/${value.value}`)
        .then((res) => {
          const { sous_famille, article, quantite, prix } = res.data;
          updatedFamilles[index] = {
            ...updatedFamilles[index],
            sous_famille,
            article,
            quantite,
            prix,
          };
          setFamilles(updatedFamilles);
        })
        .catch((err) => {
          console.log("Error fetching familles data:", err);
        });
    }
    setFamilles(updatedFamilles);
  };

  const addFamille = () => {
    setFamilles([
      ...familles,
      {
        famille: "",
        sous_famille: "",
        article: "",
        quantite: 0,
        prix: 0,
      },
    ]);
  };

  const removeFamille = (index) => {
    const updatedFamilles = [...familles];
    updatedFamilles.splice(index, 1);
    setFamilles(updatedFamilles);
  };

  const handleCancel = () => {
    navigate("/commandes");
  };

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
            <h1>Ajouter une Commande</h1>
            <br />
            <form className="forms-sample" onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Date de la Commande:</label>
                    <input
                      type="date"
                      className="form-control"
                      name="date_commande"
                      onChange={handleChange}
                      value={commande.date_commande}
                    />
                  </div>

                  <div className="form-group">
                    <label>Code Tiers:</label>

                    <select
                      style={{ color: "black" }}
                      className="form-control form-control-lg"
                      name="code_tiers"
                      onChange={handleChange}
                      value={commande.code_tiers}
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
                    <label>N° de la commande:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="num_commande"
                      onChange={handleChange}
                      value={commande.num_commande}
                      placeholder="N° de la commande"
                    />
                  </div>

                  <div className="form-group">
                    <label>Montant de la Commande:</label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="text"
                        className="form-control"
                        name="montant_commande"
                        onChange={handleChange}
                        value={commande.montant_commande}
                        placeholder="Montant de la Commande"
                      />
                      &nbsp;
                      <span>DT</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Tiers Saisie:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="tiers_saisie"
                      onChange={handleChange}
                      value={commande.tiers_saisie}
                      placeholder="Tiers Saisie"
                      readOnly
                    />
                  </div>

                  <div className="form-group">
                    <label>Date de livraison prévue:</label>
                    <input
                      type="date"
                      className="form-control"
                      name="date_livraison_prevue"
                      onChange={handleChange}
                      value={commande.date_livraison_prevue}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label>Observations:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="observations"
                      onChange={handleChange}
                      value={commande.observations}
                      placeholder="Observations"
                    />
                  </div>

                  <div className="form-group">
                    <label>Document fichier:</label>
                    <input
                      type="file"
                      className="form-control"
                      name="document_fichier"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <br />
              <hr />
              <br />
              <h3>Familles</h3>
              <br />

              {familles.map((famille, index) => (
                <div key={index} className="row mb-3">
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Famille:</label>
                      <Select
                        options={options}
                        onChange={(value) =>
                          handleChangeFamille(value, index)
                        }
                        value={options.find(
                          (option) => option.value === famille.famille
                        )}
                        isClearable
                      />
                    </div>
                  </div>

                  <div className="col-md-2">
                    <div className="form-group">
                      <label>Sous Famille:</label>
                      <input
                        type="text"
                        className="form-control"
                        value={famille.sous_famille}
                        onChange={(e) =>
                          handleChangeFamille(e, index, "sous_famille")
                        }
                      />
                    </div>
                  </div>

                  <div className="col-md-2">
                    <div className="form-group">
                      <label>Article:</label>
                      <input
                        type="text"
                        className="form-control"
                        value={famille.article}
                        onChange={(e) =>
                          handleChangeFamille(e, index, "article")
                        }
                      />
                    </div>
                  </div>

                  <div className="col-md-1">
                    <div className="form-group">
                      <label>Quantité:</label>
                      <input
                        type="number"
                        className="form-control"
                        value={famille.quantite}
                        onChange={(e) =>
                          handleChangeFamille(e, index, "quantite")
                        }
                      />
                    </div>
                  </div>

                  <div className="col-md-2">
                    <div className="form-group">
                      <label>Prix:</label>
                      <input
                        type="number"
                        className="form-control"
                        value={famille.prix}
                        onChange={(e) =>
                          handleChangeFamille(e, index, "prix")
                        }
                      />
                    </div>
                  </div>

                  <div className="col-md-1">
                    <div className="form-group">
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => removeFamille(index)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                className="btn btn-info"
                onClick={addFamille}
              >
                Ajouter une Famille
              </button>
              <br />
              <br />
              <div className="d-flex justify-content-between">
                <button type="submit" className="btn btn-primary">
                  Enregistrer
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

export default AddCommande;
