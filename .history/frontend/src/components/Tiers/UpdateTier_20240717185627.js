import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import Swal from 'sweetalert2';

const UpdateTier = ({ isSidebarOpen }) => {
  const { id } = useParams();

  const [tier, setTier] = useState({
    code_tiers: "",
    date_creation: "",
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

  const navigate = useNavigate();

  const villesTunisie = [
    "Tunis", "Ariana", "Ben Arous", "La Manouba", "Nabeul", "Zaghouan",
    "Bizerte", "Béja", "Jendouba", "Le Kef", "Siliana", "Sousse",
    "Monastir", "Mahdia", "Sfax", "Kairouan", "Kasserine", "Sidi Bouzid",
    "Gabès", "Médenine", "Tataouine", "Gafsa", "Tozeur", "Kebili"
  ];

  const paysOptions = [
    { value: "Tunisie", label: "Tunisie" },
    { value: "France", label: "France" },
    { value: "Canada", label: "Canada" },
    { value: "Italy", label: "Italy" },
    { value: "Germany", label: "Germany" },
    { value: "United Arab Emirates", label: "United Arab Emirates" },
    { value: "Autre", label: "Autre" },
  ];

  const banquesOptions = [
    { value: "Al Baraka Bank", label: "Al Baraka Bank" },
    { value: "AMEN BANK", label: "AMEN BANK" },
    { value: "ARAB TUNISIAN BANK", label: "ARAB TUNISIAN BANK" },
    { value: "ATTIJARI BANK", label: "ATTIJARI BANK" },
    { value: "BANQUE DE TUNISIE", label: "BANQUE DE TUNISIE" },
    { value: "BANQUE INTERNATIONALE ARABE DE TUNISIE (BIAT)", label: "BANQUE INTERNATIONALE ARABE DE TUNISIE (BIAT)" },
    { value: "BH BANK", label: "BH BANK" },
    { value: "BANQUE ZITOUNA", label: "BANQUE ZITOUNA" },
    { value: "UNION INTERNATIONALE DE BANQUES", label: "UNION INTERNATIONALE DE BANQUES" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTier((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSelectChange = (selectedOption, actionMeta) => {
    const { name } = actionMeta;
    setTier((prev) => ({ ...prev, [name]: selectedOption.value }));
  };

  const handleMultiSelectChange = (selectedOptions) => {
    setTier((prev) => ({ ...prev, banques: selectedOptions }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await axios.put(`http://localhost:5000/tiers/${id}`, tier);
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Les données du tiers ont été mises à jour avec succès.',
      }).then(() => {
        navigate("/tiers");
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du tiers :", error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Une erreur est survenue lors de la mise à jour du tiers.',
      });
    }
  };

  useEffect(() => {
    const fetchTier = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/tiers/${id}`);
        setTier(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération du tier :", error);
      }
    };

    fetchTier();
  }, [id]);

  return (
    <div className={`main-content ${isSidebarOpen ? "sidebar-open" : ""}`}>
      <div className="container">
        <h1>Modifier le Tier</h1>
        <form onSubmit={handleSubmit}>
          {/* Champs de formulaire */}
          {/* Code Tiers */}
          <div className="form-group">
            <label htmlFor="code_tiers">Code Tiers</label>
            <input
              type="text"
              id="code_tiers"
              name="code_tiers"
              value={tier.code_tiers}
              onChange={handleChange}
              className={errors.code_tiers ? "is-invalid" : ""}
            />
            {errors.code_tiers && (
              <div className="invalid-feedback">{errors.code_tiers}</div>
            )}
          </div>

          {/* Date de Création */}
          <div className="form-group">
            <label htmlFor="date_creation">Date de Création</label>
            <input
              type="date"
              id="date_creation"
              name="date_creation"
              value={tier.date_creation}
              onChange={handleChange}
              className={errors.date_creation ? "is-invalid" : ""}
            />
            {errors.date_creation && (
              <div className="invalid-feedback">{errors.date_creation}</div>
            )}
          </div>

          {/* Type */}
          <div className="form-group">
            <label htmlFor="type">Type</label>
            <select
              id="type"
              name="type"
              value={tier.type}
              onChange={handleChange}
              className={errors.type ? "is-invalid" : ""}
            >
              <option value="">Sélectionner un type</option>
              <option value="Client">Client</option>
              <option value="Fournisseur">Fournisseur</option>
              <option value="Autre">Autre</option>
            </select>
            {errors.type && (
              <div className="invalid-feedback">{errors.type}</div>
            )}
          </div>

          {/* Identité */}
          <div className="form-group">
            <label htmlFor="identite">Identité</label>
            <input
              type="text"
              id="identite"
              name="identite"
              value={tier.identite}
              onChange={handleChange}
              className={errors.identite ? "is-invalid" : ""}
            />
            {errors.identite && (
              <div className="invalid-feedback">{errors.identite}</div>
            )}
          </div>

          {/* MF/CIN */}
          <div className="form-group">
            <label htmlFor="MF_CIN">MF/CIN</label>
            <input
              type="text"
              id="MF_CIN"
              name="MF_CIN"
              value={tier.MF_CIN}
              onChange={handleChange}
              className={errors.MF_CIN ? "is-invalid" : ""}
            />
            {errors.MF_CIN && (
              <div className="invalid-feedback">{errors.MF_CIN}</div>
            )}
          </div>

          {/* Téléphone */}
          <div className="form-group">
            <label htmlFor="tel">Téléphone</label>
            <input
              type="text"
              id="tel"
              name="tel"
              value={tier.tel}
              onChange={handleChange}
              className={errors.tel ? "is-invalid" : ""}
            />
            {errors.tel && (
              <div className="invalid-feedback">{errors.tel}</div>
            )}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={tier.email}
              onChange={handleChange}
              className={errors.email ? "is-invalid" : ""}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>

          {/* Adresse */}
          <div className="form-group">
            <label htmlFor="adresse">Adresse</label>
            <input
              type="text"
              id="adresse"
              name="adresse"
              value={tier.adresse}
              onChange={handleChange}
              className={errors.adresse ? "is-invalid" : ""}
            />
            {errors.adresse && (
              <div className="invalid-feedback">{errors.adresse}</div>
            )}
          </div>

          {/* Ville */}
          <div className="form-group">
            <label htmlFor="ville">Ville</label>
            <select
              id="ville"
              name="ville"
              value={tier.ville}
              onChange={handleChange}
              className={errors.ville ? "is-invalid" : ""}
            >
              <option value="">Sélectionner une ville</option>
              {villesTunisie.map((ville, index) => (
                <option key={index} value={ville}>
                  {ville}
                </option>
              ))}
            </select>
            {errors.ville && (
              <div className="invalid-feedback">{errors.ville}</div>
            )}
          </div>

          {/* Pays */}
          <div className="form-group">
            <label htmlFor="pays">Pays</label>
            <Select
              id="pays"
              name="pays"
              options={paysOptions}
              value={paysOptions.find(option => option.value === tier.pays)}
              onChange={handleSelectChange}
              className={errors.pays ? "is-invalid" : ""}
            />
            {errors.pays && (
              <div className="invalid-feedback">{errors.pays}</div>
            )}
          </div>

          {/* Banques */}
          <div className="form-group">
            <label htmlFor="banques">Banques</label>
            <Select
              id="banques"
              name="banques"
              isMulti
              options={banquesOptions}
              value={tier.banques}
              onChange={handleMultiSelectChange}
              className={errors.banques ? "is-invalid" : ""}
            />
            {errors.banques && (
              <div className="invalid-feedback">{errors.banques}</div>
            )}
          </div>

          {/* Observations */}
          <div className="form-group">
            <label htmlFor="observations">Observations</label>
            <textarea
              id="observations"
              name="observations"
              value={tier.observations}
              onChange={handleChange}
            ></textarea>
          </div>

          <button type="submit">Enregistrer</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateTier;
