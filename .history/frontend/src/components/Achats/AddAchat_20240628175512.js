import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Connexion/UserProvider";

const AddAchat = ({ isSidebarOpen }) => {
  const { user } = useContext(UserContext);

  const [achat, setAchat] = useState({
    date_saisie: new Date().toISOString().split("T")[0],
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

  const [errors, setErrors] = useState({});
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
      const selectedCodeTier = codeTiers.find(
        (codeTier) => codeTier.code_tiers === value
      );
      if (selectedCodeTier) {
        setAchat((prev) => ({
          ...prev,
          code_tiers: selectedCodeTier.code_tiers,
          tiers_saisie: selectedCodeTier.identite,
        }));
      } else {
        setAchat((prev) => ({
          ...prev,
          code_tiers: "",
          tiers_saisie: "",
        }));
      }
      validateField("code_tiers", value); // Ajoutez cette ligne pour valider le champ "code_tiers"
    } else if (name === "document_fichier" && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result.split(",")[1];
        const url = `data:image/png;base64,${base64Data}`;
        setAchat((prev) => ({ ...prev, document_fichier: url }));
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setAchat((prev) => ({ ...prev, [name]: value }));
      validateField(name, value);
    }
  };

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "code_tiers":
        error = value ? "" : "Code Tiers est obligatoire";
        break;
      case "type_piece":
        error = value ? "" : "Type de la Pièce est obligatoire";
        break;
      case "statut":
        error = value ? "" : "Statut de la Pièce est obligatoire";
        break;
      case "date_piece":
        error = value ? "" : "Date de la Pièce est obligatoire";
        break;
      case "num_piece":
        error = value ? "" : "N° de la Pièce est obligatoire";
        break;
      case "montant_HT_piece":
        error = value && !isNaN(value) ? "" : "Montant HT doit être un nombre valide";
        break;
      case "FODEC_piece":
        error = value && !isNaN(value) ? "" : "FODEC doit être un nombre valide";
        break;
      case "TVA_piece":
        error = value && !isNaN(value) ? "" : "TVA doit être un nombre valide";
        break;
      case "timbre_piece":
        error = value && !isNaN(value) ? "" : "Timbre doit être un nombre valide";
        break;
      case "autre_montant_piece":
        error = value && !isNaN(value) ? "" : "Autres Montants doit être un nombre valide";
        break;
      case "montant_total_piece":
        error = value && !isNaN(value) ? "" : "Montant Total doit être un nombre valide";
        break;
      case "document_fichier":
        error = value ? "" : "Document de la Pièce est obligatoire";
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const axiosWithAuth = () => {
    const token = localStorage.getItem("token");
  
    return axios.create({
      baseURL: "http://localhost:5000",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const handleClick = async (e) => {
    e.preventDefault();

    // Valider tous les champs avant la soumission
    Object.keys(achat).forEach((key) => validateField(key, achat[key]));

    // Vérifier s'il y a des erreurs
    const hasErrors = Object.values(errors).some((error) => error !== "");

    if (!hasErrors) {
      const axiosInstance = axiosWithAuth();

      try {
        let postData = { ...achat };

        // Post the purchase data
        await axiosInstance.post("http://localhost:5000/achats", postData);

        if (user.role === "comptable") {
          // Add notification
          const notificationMessage = `${user.identite} a ajouté un achat`;

          // Ensure both userId and message are included in the request body
          const notificationData = {
            userId: user.id,
            message: notificationMessage,
          };

          await axiosInstance.post("http://localhost:5000/notifications", notificationData);
        }
        // Navigate to the purchase page
        navigate("/achats");
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleCancel = () => {
    navigate("/achats");
  };

  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? 'shifted' : ''}`}>
        <div className="card">
          <div className="card-body">
            <h1 className="text-center">Ajouter un Achat</h1>
            <br />
            <form className="forms-sample">
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Date de Saisie:</label>
                    <input
                      type="date"
                      className={`form-control ${
                        errors.date_saisie && "is-invalid"
                      }`}
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
                      className={`form-control ${
                        errors.date_piece && "is-invalid"
                      }`}
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

                  <div className="form-group">
                    <label>Numéro de la Pièce:</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.num_piece && "is-invalid"
                      }`}
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

                  <div className="form-group">
                    <label>Type de la Pièce:</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.type_piece && "is-invalid"
                      }`}
                      name="type_piece"
                      onChange={handleChange}
                      value={achat.type_piece}
                    />
                    {errors.type_piece && (
                      <div className="invalid-feedback">
                        {errors.type_piece}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Statut de la Pièce:</label>
                    <select
                      className={`form-control ${
                        errors.statut && "is-invalid"
                      }`}
                      name="statut"
                      onChange={handleChange}
                      value={achat.statut}
                    >
                      <option value="">Sélectionner un statut</option>
                      <option value="validé">Validé</option>
                      <option value="en attente">En attente</option>
                      <option value="refusé">Refusé</option>
                    </select>
                    {errors.statut && (
                      <div className="invalid-feedback">{errors.statut}</div>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <label>Code Tiers:</label>
                    <select
                      className={`form-control ${
                        errors.code_tiers && "is-invalid"
                      }`}
                      name="code_tiers"
                      onChange={handleChange}
                      value={achat.code_tiers}
                    >
                      <option value="">Sélectionner un code tiers</option>
                      {codeTiers.map((codeTier) => (
                        <option
                          key={codeTier.code_tiers}
                          value={codeTier.code_tiers}
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
                    <label>Identité Tiers Saisie:</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.tiers_saisie && "is-invalid"
                      }`}
                      name="tiers_saisie"
                      onChange={handleChange}
                      value={achat.tiers_saisie}
                    />
                    {errors.tiers_saisie && (
                      <div className="invalid-feedback">
                        {errors.tiers_saisie}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Montant HT de la Pièce:</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.montant_HT_piece && "is-invalid"
                      }`}
                      name="montant_HT_piece"
                      onChange={handleChange}
                      value={achat.montant_HT_piece}
                    />
                    {errors.montant_HT_piece && (
                      <div className="invalid-feedback">
                        {errors.montant_HT_piece}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>FODEC:</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.FODEC_piece && "is-invalid"
                      }`}
                      name="FODEC_piece"
                      onChange={handleChange}
                      value={achat.FODEC_piece}
                    />
                    {errors.FODEC_piece && (
                      <div className="invalid-feedback">
                        {errors.FODEC_piece}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>TVA:</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.TVA_piece && "is-invalid"
                      }`}
                      name="TVA_piece"
                      onChange={handleChange}
                      value={achat.TVA_piece}
                    />
                    {errors.TVA_piece && (
                      <div className="invalid-feedback">{errors.TVA_piece}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Timbre:</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.timbre_piece && "is-invalid"
                      }`}
                      name="timbre_piece"
                      onChange={handleChange}
                      value={achat.timbre_piece}
                    />
                    {errors.timbre_piece && (
                      <div className="invalid-feedback">
                        {errors.timbre_piece}
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <label>Autres Montants:</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.autre_montant_piece && "is-invalid"
                      }`}
                      name="autre_montant_piece"
                      onChange={handleChange}
                      value={achat.autre_montant_piece}
                    />
                    {errors.autre_montant_piece && (
                      <div className="invalid-feedback">
                        {errors.autre_montant_piece}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Montant Total:</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.montant_total_piece && "is-invalid"
                      }`}
                      name="montant_total_piece"
                      onChange={handleChange}
                      value={achat.montant_total_piece}
                    />
                    {errors.montant_total_piece && (
                      <div className="invalid-feedback">
                        {errors.montant_total_piece}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Document de la Pièce:</label>
                    <input
                      type="file"
                      className={`form-control ${
                        errors.document_fichier && "is-invalid"
                      }`}
                      name="document_fichier"
                      onChange={handleChange}
                    />
                    {errors.document_fichier && (
                      <div className="invalid-feedback">
                        {errors.document_fichier}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Observations:</label>
                    <textarea
                      className={`form-control ${
                        errors.observations && "is-invalid"
                      }`}
                      name="observations"
                      rows="4"
                      onChange={handleChange}
                      value={achat.observations}
                    ></textarea>
                    {errors.observations && (
                      <div className="invalid-feedback">
                        {errors.observations}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button
                className="btn btn-primary mr-2"
                onClick={handleClick}
              >
                Enregistrer
              </button>
              <button
                className="btn btn-light"
                onClick={handleCancel}
              >
                Annuler
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAchat;
