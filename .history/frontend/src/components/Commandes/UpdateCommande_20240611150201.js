import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


const UpdateCommande = ({isSidebarOpen}) => {
  const { id } = useParams();

  // État initial de la commande et des familles
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
  };

  // États pour stocker la commande, les familles et les codes tiers
  const [commande, setCommande] = useState(initialCommandeState);
  const [familles, setFamilles] = useState([initialFamilleState]);
  const [codeTiers, setCodeTiers] = useState([]);

  // Utilisation du hook useNavigate pour la navigation
  const navigate = useNavigate();

  // Effet pour récupérer les données de la commande et des familles depuis le serveur
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/commande/${id}`);
        const { data } = response;
        setCommande(data.commande);
        setFamilles(data.familles || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("An error occurred while fetching data. Please try again.");
      }
    };

    fetchData();
  }, [id]);

  // Effet pour récupérer les codes tiers depuis le serveur
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

  // Fonction de gestion des changements dans les champs de la commande
  const handleChange = (e) => {
    const { name, files } = e.target;

    if (name === "document_fichier" && files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result.split(",")[1]; // Extracting base64 data
        const url = `data:image/png;base64,${base64Data}`; // Assuming it's PNG format
        setCommande((prev) => ({ ...prev, document_fichier: url }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setCommande((prev) => ({ ...prev, [name]: e.target.value }));
    }
  };

  // Fonction de gestion des changements dans les champs de la famille
  const handleChangeFamille = (e, index) => {
    const { name, value } = e.target;
    const updatedFamilles = [...familles];
    updatedFamilles[index][name] = value;
    setFamilles(updatedFamilles);
  };

  // Fonction pour ajouter une nouvelle famille
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


  const removeFamille = async (index, familleId) => {
    try {
      // Supprimer la famille de la base de données
      await axios.delete(`http://localhost:5000/familles/${familleId}`);

      // Mettre à jour l'état local des familles
      const updatedFamilles = familles.filter((_, i) => i !== index);
      setFamilles(updatedFamilles);
    } catch (error) {
      console.error("Erreur lors de la suppression du famille :", error);
    }
  };


  // Fonction pour soumettre le formulaire
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

      await axios.put(`http://localhost:5000/commande/${id}`, {
        commande,
        familles: formattedFamilles,
      });
      alert("Commande mis à jour avec succès.");
      navigate("/commandes");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du Commande :", error);
      alert("Erreur lors de la mise à jour du Commande.");
    }
  };

  // Fonction pour annuler la modification de la commande
  const handleCancel = () => {
    navigate("/commandes");
  };

  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? 'shifted' : ''}`}>
      <div className="card">
          <div className="card-body">
            <h1>Modifier une Commande</h1>
            <br />
            <form className="forms-sample" onSubmit={handleSubmit}>
            <div className="row">
                <div className="col-md-4">

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

                <div className="col-md-4">
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
                
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Tiers Saisie:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="tiers_saisie"
                      onChange={handleChange}
                      value={commande.tiers_saisie}
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

                <div className="col-md-4">
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
                
                <div className="col-md-4">
                <div className="form-group">
                    <label>Observations :</label>
                    <textarea
                      className="form-control"
                      name="observations"
                      placeholder="Entrez vos observations ici..."

                      onChange={handleChange}
                      value={commande.observations}
                    />
                  </div>
                  </div>

                
              </div>
              <br></br>
              <br></br>
              <hr />
              <legend>Familles</legend>
              {/* Zone de saisie pour les familles */}
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
                          value={famille.famille}
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
                          value={famille.sous_famille}
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
                          value={famille.article}
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
                          value={famille.quantite}
                          onChange={(e) => handleChangeFamille(e, index)}
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group d-flex align-items-end mt-2">
                        <button
                          onClick={() => removeFamille(index)}
                          type="button"
                          className="btn btn-danger btn-sm m-2"
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
                className="d-flex justify-content-center"
              >
                <button
                  type="submit"
                  className="btn btn-primary mr-2"
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

export default UpdateCommande;
