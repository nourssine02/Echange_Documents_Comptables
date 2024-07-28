import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { UserContext } from "../Connexion/UserProvider";

const AddTier = ({ isSidebarOpen }) => {
  const { user } = useContext(UserContext);
  const [alert, setAlert] = useState(null);

  const [tier, setTier] = useState({
    code_tiers: "",
    date_creation: new Date().toISOString().split("T")[0],
    type: "",
    identite: "",
    MF_CIN: "",
    tel: "",
    email: "",
    adresse: "",
    ville: "",
    pays: "",
    observations: "",
    autreType: "",
    banques: [],
  });

  const [errors, setErrors] = useState({
    code_tiers: "",
    date_creation: "",
    type: "",
    identite: "",
    MF_CIN: "",
    tel: "",
    email: "",
    adresse: "",
  });

  const banquesOptions = [
    { value: 1, label: "Al Baraka Bank" },
    { value: 2, label: "AMEN BANK" },
    { value: 3, label: "ARAB TUNISIAN BANK" },
    { value: 4, label: "ATTIJARI BANK" },
    { value: 5, label: "BANQUE DE TUNISIE" },
    { value: 6, label: "BANQUE INTERNATIONALE ARABE DE TUNISIE (BIAT)" },
    { value: 7, label: "BH BANK" },
    { value: 8, label: "BANQUE ZITOUNA" },
    { value: 9, label: "UNION INTERNATIONALE DE BANQUES" },
  ];

  const paysOptions = [
    { value: "Tunisie", label: "Tunisie" },
    { value: "Algérie", label: "Algérie" },
    { value: "Maroc", label: "Maroc" },
    { value: "France", label: "France" },
    { value: "Canada", label: "Canada" },
    { value: "Italie", label: "Italie" },
    { value: "Allemagne", label: "Allemagne" },
    { value: "United Arab Emirates", label: "United Arab Emirates" },
    { value: "Autre", label: "Autre" },
  ];

  const navigate = useNavigate();

  const villesTunisie = [
    "Tunis",
    "Ariana",
    "Ben Arous",
    "La Manouba",
    "Nabeul",
    "Zaghouan",
    "Bizerte",
    "Béja",
    "Jendouba",
    "Le Kef",
    "Siliana",
    "Sousse",
    "Monastir",
    "Mahdia",
    "Sfax",
    "Kairouan",
    "Kasserine",
    "Sidi Bouzid",
    "Gabès",
    "Médenine",
    "Tataouine",
    "Gafsa",
    "Tozeur",
    "Kebili",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTier((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSelectChange = (selectedOption) => {
    setTier((prev) => ({
      ...prev,
      pays: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleMultiSelectChange = (selectedOptions) => {
    setTier((prev) => ({ ...prev, banques: selectedOptions }));
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

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "code_tiers":
        error = value ? "" : "Code Tiers est obligatoire";
        break;
      case "date_creation":
        error = value ? "" : "Date de Création est obligatoire";
        break;
      case "type":
        error = value ? "" : "Type est obligatoire";
        break;
      case "identite":
        error = value ? "" : "Identité est obligatoire";
        break;
      case "MF_CIN":
        error = value ? "" : "MF/CIN est obligatoire";
        break;
      case "tel":
        error = /^\d{8,}$/.test(value)
          ? ""
          : "Téléphone doit contenir au moins 8 chiffres";
        break;
      case "email":
        error = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? ""
          : "Email n'est pas valide";
        break;
      case "adresse":
        error = value ? "" : "Adresse est obligatoire";
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
    return error === "";
  };

  const validateForm = () => {
    const validationErrors = {};
    let isValid = true;

    for (const field in errors) {
      const value = tier[field];
      if (!validateField(field, value)) {
        validationErrors[field] = errors[field];
        isValid = false;
      }
    }

    setErrors(validationErrors);
    return isValid;
  };

  const handleClick = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      console.log(
        "Form contains errors. Please correct them before submitting."
      );
      return;
    }

    const axiosInstance = axiosWithAuth();

    try {
      let postData = { ...tier };

      // Post the tier data
      await axiosInstance.post("/tiers", postData);

      // Add notification
      const notificationMessage = `${user.identite} a ajouté un tier`;

      const notificationData = {
        userId: user.id,
        message: notificationMessage,
      };

      await axiosInstance.post("/notifications", notificationData);

      // Set success alert
      setAlert({
        type: "success",
        message: "Tier est ajouté avec succès",
      });

      // Navigate to the tiers page after a short delay
      setTimeout(() => {
        navigate("/tiers");
      }, 2000);
    } catch (err) {
      console.log(err);
      // Set error alert
      setAlert({
        type: "danger",
        message: "Tier n'est pas ajouté avec succès",
      });
    }
  };

  const handleCancel = () => {
    navigate("/tiers");
  };

  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? "shifted" : ""}`}>
        <div className="card">
          <div className="card-body">
            <h1 className="text-center">Ajouter un Tier</h1>
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
            <form className="forms-sample" onSubmit={handleClick}>
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Date de Création:</label>
                    <input
                      type="date"
                      className={`form-control ${
                        errors.date_creation ? "is-invalid" : ""
                      }`}
                      name="date_creation"
                      onChange={handleChange}
                      value={tier.date_creation}
                    />
                    {errors.date_creation && (
                      <div className="invalid-feedback">
                        {errors.date_creation}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Code Tiers:</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.code_tiers ? "is-invalid" : ""
                      }`}
                      name="code_tiers"
                      onChange={handleChange}
                      placeholder="Code Tiers"
                      value={tier.code_tiers}
                    />
                    {errors.code_tiers && (
                      <div className="invalid-feedback">
                        {errors.code_tiers}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Email:</label>
                    <input
                      type="email"
                      className={`form-control ${
                        errors.email ? "is-invalid" : ""
                      }`}
                      name="email"
                      onChange={handleChange}
                      placeholder="Email"
                      value={tier.email}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Adresse:</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.adresse ? "is-invalid" : ""
                      }`}
                      name="adresse"
                      onChange={handleChange}
                      placeholder="Adresse"
                      value={tier.adresse}
                    />
                    {errors.adresse && (
                      <div className="invalid-feedback">{errors.adresse}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>MF/CIN:</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.MF_CIN ? "is-invalid" : ""
                      }`}
                      name="MF_CIN"
                      onChange={handleChange}
                      placeholder="MF/CIN"
                      value={tier.MF_CIN}
                    />
                    {errors.MF_CIN && (
                      <div className="invalid-feedback">{errors.MF_CIN}</div>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <label>Identité:</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.identite ? "is-invalid" : ""
                      }`}
                      name="identite"
                      onChange={handleChange}
                      placeholder="Identité"
                      value={tier.identite}
                    />
                    {errors.identite && (
                      <div className="invalid-feedback">
                        {errors.identite}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Téléphone:</label>
                    <input
                      type="tel"
                      className={`form-control ${errors.tel ? "is-invalid" : ""}`}
                      name="tel"
                      onChange={handleChange}
                      placeholder="Téléphone"
                      value={tier.tel}
                    />
                    {errors.tel && (
                      <div className="invalid-feedback">{errors.tel}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Observations:</label>
                    <textarea
                      className="form-control"
                      name="observations"
                      onChange={handleChange}
                      rows="3"
                      value={tier.observations}
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label>Type:</label>
                    <select
                      className={`form-control ${errors.type ? "is-invalid" : ""}`}
                      name="type"
                      onChange={handleChange}
                      value={tier.type}
                    >
                      <option value="">Sélectionner un type</option>
                      <option value="Fournisseur">Fournisseur</option>
                      <option value="Client">Client</option>
                      <option value="Prospect">Prospect</option>
                      <option value="Autre">Autre</option>
                    </select>
                    {errors.type && (
                      <div className="invalid-feedback">{errors.type}</div>
                    )}
                  </div>

                  {tier.type === "Autre" && (
                    <div className="form-group">
                      <label>Autre Type:</label>
                      <input
                        type="text"
                        className="form-control"
                        name="autreType"
                        onChange={handleChange}
                        value={tier.autreType}
                      />
                    </div>
                  )}

                  <div className="form-group">
                    <label>Ville:</label>
                    <select
                      className="form-control"
                      name="ville"
                      onChange={handleChange}
                      value={tier.ville}
                    >
                      <option value="">Sélectionner une ville</option>
                      {villesTunisie.map((ville) => (
                        <option key={ville} value={ville}>
                          {ville}
                        </option>
                      ))}
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <label>Pays:</label>
                    <Select
                      options={paysOptions}
                      onChange={handleSelectChange}
                      value={paysOptions.find(
                        (option) => option.value === tier.pays
                      )}
                      isClearable
                      isSearchable
                    />
                  </div>

                  <div className="form-group">
                    <label>Banques:</label>
                    <Select
                      options={banquesOptions}
                      onChange={handleMultiSelectChange}
                      value={tier.banques}
                      isMulti
                      isSearchable
                      isClearable
                    />
                  </div>

                  <div className="d-flex justify-content-between mt-4">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleCancel}
                    >
                      Annuler
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Enregistrer
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTier;
