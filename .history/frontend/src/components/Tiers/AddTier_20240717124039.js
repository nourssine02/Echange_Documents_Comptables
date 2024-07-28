import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { UserContext } from "../Connexion/UserProvider";

const AddTier = ({ isSidebarOpen }) => {
  const { user } = useContext(UserContext);
  const [alert, setAlert] = useState(null); // State for alert messages

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

  const [banquesOptions] = useState([
    { value: 1, label: "Al Baraka Bank" },
    { value: 2, label: "AMEN BANK" },
    { value: 3, label: "ARAB TUNISIAN BANK" },
    { value: 4, label: "ATTIJARI BANK" },
    { value: 5, label: "BANQUE DE TUNISIE" },
    { value: 6, label: "BANQUE INTERNATIONALE ARABE DE TUNISIE (BIAT)" },
    { value: 7, label: "BH BANK" },
    { value: 8, label: "BANQUE ZITOUNA" },
    { value: 9, label: "UNION INTERNATIONALE DE BANQUES" },
  ]);

  const [paysOptions] = useState([
    { value: "Tunisie", label: "Tunisie" },
    { value: "Algérie", label: "Algérie" },
    { value: "Maroc", label: "Maroc" },
    { value: "France", label: "France" },
    { value: "Canada", label: "Canada" },
    { value: "Italie", label: "Italie" },
    { value: "Allemagne", label: "Allemagne" },
    { value: "United Arab Emirates", label: "United Arab Emirates" },
  ]);

  const navigate = useNavigate();

  const villesTunisie = [
    "Tunis", "Ariana", "Ben Arous", "La Manouba", "Nabeul", "Zaghouan", "Bizerte", "Béja", "Jendouba", "Le Kef", "Siliana", 
    "Sousse", "Monastir", "Mahdia", "Sfax", "Kairouan", "Kasserine", "Sidi Bouzid", "Gabès", "Médenine", "Tataouine", 
    "Gafsa", "Tozeur", "Kebili"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTier((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSelectChange = (selectedOption) => {
    setTier((prev) => ({ ...prev, pays: selectedOption ? selectedOption.value : "" }));
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
        error = /^\d{8,}$/.test(value) ? "" : "Téléphone invalide";
        break;
      case "email":
        error = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "Email invalide";
        break;
      case "adresse":
        error = value ? "" : "Adresse est obligatoire";
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const isFormValid = () => {
    const isValid = !Object.values(errors).some((error) => error);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      console.log("Le formulaire contient des erreurs.");
      return;
    }

    axios
      .post("/tiers", tier, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setAlert({ type: "success", message: "Tier ajouté avec succès." }); // Success alert
        setTimeout(() => {
          navigate("/tiers");
        }, 2000);
      })
      .catch((err) => {
        console.error(err);
        setAlert({ type: "error", message: "Erreur lors de l'ajout du tier." }); // Error alert
      });
  };

  return (
    <div className="main-panel">
    <div className={`content-wrapper ${isSidebarOpen ? "shifted" : ""}`}>
      <div className="card">
        <div className="card-body">
        <h2>Ajouter un Tier</h2>
        {alert && (
          <div className={`alert ${alert.type}`}>
            {alert.message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="code_tiers">Code Tiers :</label>
            <input
              type="text"
              id="code_tiers"
              name="code_tiers"
              value={tier.code_tiers}
              onChange={handleChange}
            />
            {errors.code_tiers && <span className="error-message">{errors.code_tiers}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="date_creation">Date de Création :</label>
            <input
              type="date"
              id="date_creation"
              name="date_creation"
              value={tier.date_creation}
              onChange={handleChange}
            />
            {errors.date_creation && <span className="error-message">{errors.date_creation}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="type">Type :</label>
            <select
              id="type"
              name="type"
              value={tier.type}
              onChange={handleChange}
            >
              <option value="">Sélectionnez un type</option>
              <option value="client">Client</option>
              <option value="fournisseur">Fournisseur</option>
              <option value="Autre">Autre</option>
            </select>
            {tier.type === "Autre" && (
              <input
                type="text"
                id="autreType"
                name="autreType"
                value={tier.autreType}
                onChange={handleChange}
                placeholder="Entrez un nouveau type"
              />
            )}
            {errors.type && <span className="error-message">{errors.type}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="identite">Identité :</label>
            <input
              type="text"
              id="identite"
              name="identite"
              value={tier.identite}
              onChange={handleChange}
            />
            {errors.identite && <span className="error-message">{errors.identite}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="MF_CIN">MF/CIN :</label>
            <input
              type="text"
              id="MF_CIN"
              name="MF_CIN"
              value={tier.MF_CIN}
              onChange={handleChange}
            />
            {errors.MF_CIN && <span className="error-message">{errors.MF_CIN}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="tel">Téléphone :</label>
            <input
              type="text"
              id="tel"
              name="tel"
              value={tier.tel}
              onChange={handleChange}
            />
            {errors.tel && <span className="error-message">{errors.tel}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="email">Email :</label>
            <input
              type="text"
              id="email"
              name="email"
              value={tier.email}
              onChange={handleChange}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="adresse">Adresse :</label>
            <input
              type="text"
              id="adresse"
              name="adresse"
              value={tier.adresse}
              onChange={handleChange}
            />
            {errors.adresse && <span className="error-message">{errors.adresse}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="ville">Ville :</label>
            <select
              id="ville"
              name="ville"
              value={tier.ville}
              onChange={handleChange}
            >
              <option value="">Sélectionnez une ville</option>
              {villesTunisie.map((ville) => (
                <option key={ville} value={ville}>{ville}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="pays">Pays :</label>
            <Select
              id="pays"
              name="pays"
              value={paysOptions.find(option => option.value === tier.pays)}
              onChange={handleSelectChange}
              options={paysOptions}
              isClearable
            />
          </div>
          <div className="form-group">
            <label htmlFor="observations">Observations :</label>
            <textarea
              id="observations"
              name="observations"
              value={tier.observations}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="banques">Banques :</label>
            <Select
              id="banques"
              name="banques"
              value={tier.banques}
              onChange={handleMultiSelectChange}
              options={banquesOptions}
              isMulti
            />
          </div>
          <button type="submit">Ajouter</button>
        </form>
      </div>
    </div>
    </div>
    </div>
  );
};

export default AddTier;
