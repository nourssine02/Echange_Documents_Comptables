import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Connexion/UserProvider";
import { Modal, Button, Form, Col, Row } from "react-bootstrap";
import Select from "react-select";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TiersSaisie from "../TiersSaisie";

const AddAchat = ({ isSidebarOpen }) => {
  const { user } = useContext(UserContext);
  const [tierErrors, setTierErrors] = useState({});

  const [isEditing, setIsEditing] = useState(false); // Ajoutez cet état pour suivre le mode modification

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
    document_fichier: null,
  });

  const [errors, setErrors] = useState({});
  const [codeTiers, setCodeTiers] = useState([]);
  const [alert, setAlert] = useState(null); // State for alert messages
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [newTier, setNewTier] = useState({
    date_creation: new Date().toISOString().split("T")[0],
    code_tiers: "",
    identite: "",
    type: "",
    autreType: "",
    MF_CIN: "",
    tel: "",
    email: "",
    adresse: "",
    banques: [],
  });

  const [banquesOptions, setBanquesOptions] = useState([]);

 
  const [isSubmitting, setIsSubmitting] = useState(false); // State for form submission

  const navigate = useNavigate();



  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/code_tiers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCodeTiers(response.data);
      } catch (error) {
        console.error("Error fetching code tiers:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "document_fichier" && e.target.files.length > 0) {
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

    // Show modal when tiers_saisie is entered
    if (name === "tiers_saisie" && value === "") {
      setShowModal(true);
    }
  };

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
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
        error =
          value && !isNaN(value) ? "" : "Montant HT doit être un nombre valide";
        break;
      case "FODEC_piece":
        error =
          value && !isNaN(value) ? "" : "FODEC doit être un nombre valide";
        break;
      case "TVA_piece":
        error = value && !isNaN(value) ? "" : "TVA doit être un nombre valide";
        break;
      case "timbre_piece":
        error =
          value && !isNaN(value) ? "" : "Timbre doit être un nombre valide";
        break;
      case "autre_montant_piece":
        error =
          value && !isNaN(value)
            ? ""
            : "Autres Montants doit être un nombre valide";
        break;
      case "montant_total_piece":
        error =
          value && !isNaN(value)
            ? ""
            : "Montant Total doit être un nombre valide";
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

  const handleModalShow = () => {
    setNewTier({
      date_creation: new Date().toISOString().split("T")[0],
      code_tiers: "",
      identite: "",
      type: "",
      autreType: "",
      MF_CIN: "",
      tel: "",
      email: "",
      adresse: "",
      banques: [],
    });
    setIsEditing(false);
    setShowModal(true);
  };

  //const handleModalShow = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);

  const validateForm = () => {
    const newErrors = {};
    if (!newTier.code_tiers)
      newErrors.code_tiers = "Le code du tiers est requis";
    if (!newTier.type) newErrors.type = "Type du tiers est requis";
    if (!newTier.identite) newErrors.identite = "L'identité est requise";
    if (!newTier.MF_CIN) newErrors.MF_CIN = "Le MF/CIN est requis";
    if (!newTier.tel) newErrors.tel = "Le téléphone est requis";
    if (!newTier.email) newErrors.email = "L'email est requis";
    if (!newTier.adresse) newErrors.adresse = "L'adresse est requise";

    return newErrors;
  };

  // const handleNewTierSubmit = async (e) => {
  //   e.preventDefault();

  //   const formErrors = validateForm();
  //   if (Object.keys(formErrors).length > 0) {
  //     setTierErrors(formErrors);
  //     return;
  //   }

  //   try {
  //     const response = await axiosWithAuth().post("/tiers", newTier);

  //     // Log the entire response object to understand its structure
  //     console.log("Full response data:", response);

  //     // Access the added tier from the response
  //     const addedTier = response.data.tier;

  //     console.log("Added tier:", addedTier);

  //     // Check if the added tier contains the expected properties
  //     if (addedTier && addedTier.code_tiers && addedTier.identite) {
  //       const tiersSaisie = `${addedTier.code_tiers} - ${addedTier.identite}`;
  //       setAchat((prevAchat) => ({
  //         ...prevAchat,
  //         tiers_saisie: tiersSaisie,
  //         code_tiers: addedTier.code_tiers

  //         //tiers_saisie: `${addedTier.code_tiers} - ${addedTier.identite}`,
  //       }));
  //     } else {
  //       console.error('Added tier does not contain the expected properties:', addedTier);
  //     }

  //     toast.success("Tier ajouté avec succès !");

  //     // Close the modal after successful submission
  //     setShowModal(false);
  //   } catch (error) {
  //     console.error("Error adding tier:", error);
  //     toast.error("Erreur lors de l'ajout du tier.");
  //   }
  // };

  const handleNewTierSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setTierErrors(formErrors);
      return;
    }

    try {
      let response;
      if (isEditing) {
        response = await axiosWithAuth().put(`/tiers/${newTier.id}`, newTier);
        toast.success("Tier modifié avec succès !");
      } else {
        response = await axiosWithAuth().post("/tiers", newTier);
        toast.success("Tier ajouté avec succès !");
      }

      const addedTier = response.data.tier;
      if (addedTier && addedTier.code_tiers && addedTier.identite) {
        const tiersSaisie = `${addedTier.code_tiers} - ${addedTier.identite}`;
        setAchat((prevAchat) => ({
          ...prevAchat,
          tiers_saisie: tiersSaisie,
          code_tiers: addedTier.code_tiers,
        }));
      } else {
        console.error(
          "Added tier does not contain the expected properties:",
          addedTier
        );
      }

      setShowModal(false);
    } catch (error) {
      console.error("Error adding tier:", error);
      toast.error("Erreur lors de l'ajout du tier.");
    }
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setNewTier({ ...newTier, [name]: value });
  };

  const handleMultiSelectChange = (selectedOptions) => {
    setNewTier((prev) => ({
      ...prev,
      //banques: selectedOptions.map((banque) => ({ value: banque.id })),
      banques: selectedOptions || [],
    }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    setIsSubmitting(true); // Start form submission

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

          await axiosInstance.post(
            "http://localhost:5000/notifications",
            notificationData
          );
        }
        setAlert({
          type: "success",
          message: "Achat est ajouté avec succès",
        });

        // Navigate to the purchase page after a short delay
        setTimeout(() => {
          navigate("/achats");
        }, 2000);
      } catch (err) {
        console.log(err);
        setAlert({
          type: "danger",
          message: "Achat n'est pas ajouté avec succès",
        });
      }
    }
    setIsSubmitting(false); // End form submission
  };

  const handleCancel = () => {
    navigate("/achats");
  };

  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? "shifted" : ""}`}>
        <div className="card">
          <div className="card-body">
            <h1 className="text-center" style={{ fontSize: "35px" }}>
              Ajouter un achat de biens et de Services
            </h1>
            <br />
            <br />
            {alert && (
              <div
                className={`alert alert-${alert.type} d-flex align-items-center`}
                role="alert"
              >
                <div>{alert.message}</div>
              </div>
            )}
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
                      placeholder="Date de la Pièce"
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
                      className="form-control"
                      name="code_tiers"
                      onChange={handleChange}
                      value={achat.code_tiers}
                    >
                      <option value="">Sélectionner le Code Tiers</option>
                      {codeTiers.map((tier) => (
                        <option
                          key={`${tier.code_tiers}-${tier.identite}`} // Utilisez une combinaison unique si nécessaire
                          value={`${tier.code_tiers} - ${tier.identite}`}
                        >
                          {`${tier.code_tiers} - ${tier.identite}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>N° de la Pièce :</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.num_piece && "is-invalid"
                      }`}
                      name="num_piece"
                      onChange={handleChange}
                      placeholder="N° de la Pièce"
                    />
                    {errors.num_piece && (
                      <div className="invalid-feedback">{errors.num_piece}</div>
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
                      onClick={handleModalShow}
                      value={achat.tiers_saisie}
                    />
                  </div>
                  <div className="form-group">
                    <label>Type de la Pièce :</label>
                    <select
                      style={{ color: "black" }}
                      className={`form-control ${
                        errors.type_piece && "is-invalid"
                      }`}
                      name="type_piece"
                      onChange={handleChange}
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
                      className={`form-control ${
                        errors.statut && "is-invalid"
                      }`}
                      name="statut"
                      onChange={handleChange}
                    >
                      <option value="">Sélectionnez...</option>
                      <option value="réglée en espèces">
                        Réglée en espèces
                      </option>
                      <option value="partiellement réglée">
                        Partiellement réglée
                      </option>
                      <option value="totalement réglée">
                        Totalement réglée
                      </option>
                      <option value="non réglée">Non Réglée</option>
                    </select>
                    {errors.statut && (
                      <div className="invalid-feedback">{errors.statut}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>FODEC sur la Pièce:</label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.FODEC_piece && "is-invalid"
                        }`}
                        name="FODEC_piece"
                        onChange={handleChange}
                        placeholder="FODEC sur la Pièce"
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
                        className={`form-control ${
                          errors.montant_total_piece && "is-invalid"
                        }`}
                        name="montant_total_piece"
                        onChange={handleChange}
                        placeholder="Montant Total de la Pièce"
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
                        className={`form-control ${
                          errors.montant_HT_piece && "is-invalid"
                        }`}
                        name="montant_HT_piece"
                        onChange={handleChange}
                        placeholder="Montant HT de la Pièce"
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
                        className={`form-control ${
                          errors.timbre_piece && "is-invalid"
                        }`}
                        name="timbre_piece"
                        onChange={handleChange}
                        placeholder="Timbre sur la Pièce"
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
                      className={`form-control ${
                        errors.document_fichier && "is-invalid"
                      }`}
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
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <label>TVA sur la Pièce:</label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.TVA_piece && "is-invalid"
                        }`}
                        name="TVA_piece"
                        onChange={handleChange}
                        placeholder="TVA sur la Pièce"
                      />
                      &nbsp;
                      <span>DT</span>
                    </div>
                    {errors.TVA_piece && (
                      <div className="invalid-feedback">{errors.TVA_piece}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Autres Montants sur la Pièce:</label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.autre_montant_piece && "is-invalid"
                        }`}
                        name="autre_montant_piece"
                        onChange={handleChange}
                        placeholder="Autres Montants sur la Pièce"
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
                      className={`form-control ${
                        errors.observations && "is-invalid"
                      }`}
                      name="observations"
                      onChange={handleChange}
                      placeholder="Observations"
                    />
                    {errors.observations && (
                      <div className="invalid-feedback">
                        {errors.observations}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <br />
              <div className="d-flex justify-content-center">
                <button className="btn btn-primary mr-2" onClick={handleClick}>
                  {isSubmitting ? "Ajout en cours..." : "Ajouter"}
                </button>
                <button className="btn btn-light" onClick={handleCancel}>
                  Annuler
                </button>
              </div>
            </form>
            <TiersSaisie showModal={showModal} setShowModal={setShowModal} />

          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAchat;
