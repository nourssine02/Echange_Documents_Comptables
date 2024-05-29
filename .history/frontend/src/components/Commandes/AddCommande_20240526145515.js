import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
    prix: 0
  };

  const [commande, setCommande] = useState(initialCommandeState);
  const [familles, setFamilles] = useState([initialFamilleState]);

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

  const [codeTiers, setCodeTiers] = useState([]);
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
        setCommande((prev) => ({
          ...prev,
          code_tiers: selectedCodeTier.code_tiers, 
          tiers_saisie: selectedCodeTier.identite // Mettre à jour le champ tiers_saisie avec l'identité correspondante
        }));
      } else {
        // If no code tier is selected, reset tiers_saisie to an empty string
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

  const handleChangeFamille = (e, index) => {
    const { name, value } = e.target;
    const updatedFamilles = [...familles];
    updatedFamilles[index][name] = value;
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
        prix: 0
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

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <div className="card">
          <div className="card-body">
            <h1>Ajouter une Commande</h1>
            <br />
            <form className="forms-sample" onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-12">
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
                </div>

                <div className="col-md-6">

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

                </div>
                <div className="col-md-6">
                
                  <div className="form-group">
                    <label>Tiers à Saisir:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="tiers_saisie"
                      onChange={handleChange}
                      value={commande.tiers_saisie}

                    />
                  </div>

                  <div className="form-group">
                    <label>Montant de la Commande:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="montant_commande"
                      onChange={handleChange}
                      value={commande.montant_commande}
                      placeholder="Montant de la Commande"
                    />
                  </div>
               
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label>Date de livraison prevue:</label>
                    <input
                      type="date"
                      className="form-control"
                      name="date_livraison_prevue"
                      onChange={handleChange}
                      value={commande.date_livraison_prevue}
                      placeholder="Date de livraison prevue"
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
                    <label>Observations:</label>
                    <textarea
                      className="form-control"
                      name="observations"
                      onChange={handleChange}
                      value={commande.observations}
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
                    <div className="col-md-4">
                      <div className="form-group mb-3">
                        <label>Famille:</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          name="famille"
                          placeholder="Nom de Famille"
                          onChange={(e) => handleChangeFamille(e, index)}
                        />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="form-group mb-3">
                        <label>Sous Famille:</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          name="sous_famille"
                          placeholder="Nom de Sous Famille"
                          onChange={(e) => handleChangeFamille(e, index)}
                        />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="form-group mb-3">
                        <label>Article:</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          name="article"
                          placeholder="Nom de l'article"
                          onChange={(e) => handleChangeFamille(e, index)}
                        />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="form-group mb-3">
                        <label>Quantité:</label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          name="quantite"
                          placeholder="Quantité de l'article"
                          onChange={(e) => handleChangeFamille(e, index)}
                        />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="form-group mb-3">
                        <label>Prix:</label>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          name="prix"
                          placeholder="Prix de l'article"
                          onChange={(e) => handleChangeFamille(e, index)}
                        />
                      </div>
                    </div>
                    
                    <div className="col-md-4 mb-2">
                      <div className="form-group d-flex align-items-end">
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

export default AddCommande;
