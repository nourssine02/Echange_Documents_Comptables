import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddLivraison = ({isSidebarOpen}) => {
  const [livraison, setLivraison] = useState({
    date_BL: new Date().toISOString().split("T")[0],
    num_BL: "",
    code_tiers: "",
    tiers_saisie: "",
    reference_commande: "",
    montant_HT_BL: "",
    TVA_B: "",
    montant_total_BL: "",
    observations: "",
    document_fichier: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "code_tiers") {
      const selectedCodeTier = codeTiers.find(
        (codeTier) => codeTier.code_tiers === value
      );
      if (selectedCodeTier) {
        setLivraison((prev) => ({
          ...prev,
          code_tiers: selectedCodeTier.code_tiers,
          tiers_saisie: selectedCodeTier.identite, // Mettre à jour le champ tiers_saisie avec l'identité correspondante
        }));
      } else {
        // If no code tier is selected, reset tiers_saisie to an empty string
        setLivraison((prev) => ({
          ...prev,
          code_tiers: "",
          tiers_saisie: "",
        }));
      }
    } else {
      setLivraison((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/livraison", livraison);
      navigate("/livraisons");
    } catch (err) {
      console.log(err);
    }
  };

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

  const [refCommandes, setRefCommandes] = useState([]);

  useEffect(() => {
    const fetchRefCommande = async () => {
      try {
        const res = await axios.get("http://localhost:5000/reference_commande");
        setRefCommandes(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchRefCommande();
  }, []);

  const handleCancel = () => {
    navigate("/livraisons");
  };

  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? 'shifted' : ''}`}>
      <div className="card">
          <div className="card-body">
            <h1 className="text-center">Ajouter une Livraison</h1>
            <br />
            <form className="forms-sample">
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Date du Bon de Livraison :</label>
                    <input
                      type="date"
                      className="form-control"
                      name="date_BL"
                      onChange={handleChange}
                      value={livraison.date_BL}
                    />
                  </div>

                  <div className="form-group">
                    <label>Code Tiers:</label>

                    <select
                      style={{ color: "black" }}
                      className="form-control form-control-lg"
                      name="code_tiers"
                      onChange={handleChange}
                      value={livraison.code_tiers}
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

                <div className="col-md-4">
                  <div className="form-group">
                    <label>Référence Commande:</label>

                    <select
                      style={{ color: "black" }}
                      className="form-control form-control-lg"
                      name="reference_commande"
                      onChange={handleChange}
                      value={livraison.reference_commande}
                    >
                      <option value="" style={{ color: "black" }}>
                        Référence Commande
                      </option>
                      {refCommandes.map((refCommande) => (
                        <option
                          key={refCommande.num_commande}
                          value={refCommande.num_commande}
                          style={{ color: "black" }}
                        >
                          {refCommande.num_commande}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>N° du Bon de Livraison:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="num_BL"
                      onChange={handleChange}
                      placeholder="N° du Bon de Livraison"
                    />
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
                      value={livraison.tiers_saisie}
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

                <div className="col-md-4">
                  <div className="form-group">
                    <label>Montant HT du Bon de Livraison:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="montant_HT_BL"
                      onChange={handleChange}
                      placeholder="Montant HT du BL"
                    />
                  </div>

                  <div className="form-group">
                    <label>TVA du Bon de Livraison:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="TVA_BL"
                      onChange={handleChange}
                      placeholder="TVA du BL"
                    />
                  </div>         
                </div>

                <div className="col-md-4">
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

                <div className="col-md-6">
                <div className="form-group">
                    <label>Montant Total du Bon de Livraison:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="montant_total_BL"
                      onChange={handleChange}
                      placeholder="Montant Total du BL"
                    />
                  </div>
                </div>
              </div>
              <div
                className="d-flex justify-content-center"
              >
                <button
                  type="submit"
                  className="btn btn-primary mr-2"
                  onClick={handleClick}
                >
                  Enregistrer
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

export default AddLivraison;
