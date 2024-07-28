import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";

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
          : "Le numéro de téléphone doit contenir au moins 8 chiffres";
        break;
      case "email":
        error = /\S+@\S+\.\S+/.test(value) ? "" : "Email doit être valide";
        break;
      case "adresse":
        error = value ? "" : "Adresse est obligatoire";
        break;
      // Ajouter les cas pour les champs observations, ville et pays
      case "observations":
      case "ville":
      case "pays":
        error = ""; // Ne pas retourner d'erreur pour ces champs facultatifs
        break;
      default:
        break;
    }
  
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };
  

  const handleClick = async (e) => {
    e.preventDefault();

    // Valider tous les champs avant la soumission
    const formValid = Object.keys(tier).reduce((acc, key) => {
      validateField(key, tier[key]);
      const isOptionalField = ["observations", "ville", "pays"].includes(key);
      return acc && (isOptionalField || !errors[key]);
    }, true);
    

    // Vérifier s'il y a des erreurs
    const hasErrors = Object.values(errors).some((error) => error !== "");

    if (formValid && !hasErrors) {
      try {
        // Mettre à jour le tier sans les banques
        await axios.put(`http://localhost:5000/tiers/${id}`, { ...tier, banques: undefined });

        // Mettre à jour les banques associées au tier
        for (const banque of tier.banques) {
          const banqueResult = await axios.get(`http://localhost:5000/banques?name=${banque.value}`);
          const banqueId = banqueResult.data.id;

          if (banqueId) {
            await axios.post('http://localhost:5000/tiers_banques', { tier_id: id, banque_id: banqueId });
          } else {
            console.error(`No banque found with name: ${banque.value}`);
          }
        }

        navigate("/tiers");
      } catch (err) {
        console.log(err);
      }
    }
  };
  
  useEffect(() => {
    axios
      .get(`http://localhost:5000/tiers/${id}`)
      .then((res) => {
        const data = res.data;
        if (!data) {
          console.error("Empty response or invalid data structure:", res);
          return;
        }
        setTier((prev) => ({
          ...prev,
          code_tiers: data.code_tiers || "",
          date_creation: data.date_creation || "",
          type: data.type || "",
          identite: data.identite || "",
          MF_CIN: data.MF_CIN || "",
          tel: data.tel || "",
          email: data.email || "",
          adresse: data.adresse || "",
          ville: data.ville || "",
          pays: data.pays || "",
          observations: data.observations || "",
        }));
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(`http://localhost:5000/tiers/${id}/banques`)
      .then((res) => {
        const banques = res.data.map((banque) => ({
          value: banque.name,
          label: banque.name,
        }));
        setTier((prev) => ({ ...prev, banques }));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  return (
    <div className={`app ${isSidebarOpen ? "sidebar-open" : ""}`}>
      <div className="app-content">
        <h1>Update Tier</h1>
        <form>
          <div className="form-group">
            <label>Code Tiers</label>
            <input
              type="text"
              name="code_tiers"
              value={tier.code_tiers}
              onChange={handleChange}
            />
            {errors.code_tiers && <span className="error">{errors.code_tiers}</span>}
          </div>

          <div className="form-group">
            <label>Date de Création</label>
            <input
              type="date"
              name="date_creation"
              value={tier.date_creation}
              onChange={handleChange}
            />
            {errors.date_creation && <span className="error">{errors.date_creation}</span>}
          </div>

          <div className="form-group">
            <label>Type</label>
            <select name="type" value={tier.type} onChange={handleChange}>
              <option value="">Sélectionner</option>
              <option value="Fournisseur">Fournisseur</option>
              <option value="Client">Client</option>
              <option value="Autre">Autre</option>
            </select>
            {errors.type && <span className="error">{errors.type}</span>}
          </div>

          {tier.type === "Autre" && (
            <div className="form-group">
              <label>Autre Type</label>
              <input
                type="text"
                name="autreType"
                value={tier.autreType}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="form-group">
            <label>Identité</label>
            <input
              type="text"
              name="identite"
              value={tier.identite}
              onChange={handleChange}
            />
            {errors.identite && <span className="error">{errors.identite}</span>}
          </div>

          <div className="form-group">
            <label>MF/CIN</label>
            <input
              type="text"
              name="MF_CIN"
              value={tier.MF_CIN}
              onChange={handleChange}
            />
            {errors.MF_CIN && <span className="error">{errors.MF_CIN}</span>}
          </div>

          <div className="form-group">
            <label>Téléphone</label>
            <input
              type="text"
              name="tel"
              value={tier.tel}
              onChange={handleChange}
            />
            {errors.tel && <span className="error">{errors.tel}</span>}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={tier.email}
              onChange={handleChange}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Adresse</label>
            <input
              type="text"
              name="adresse"
              value={tier.adresse}
              onChange={handleChange}
            />
            {errors.adresse && <span className="error">{errors.adresse}</span>}
          </div>

          <div className="form-group">
            <label>Ville</label>
            <select name="ville" value={tier.ville} onChange={handleChange}>
              <option value="">Sélectionner</option>
              {villesTunisie.map((ville, index) => (
                <option key={index} value={ville}>{ville}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Pays</label>
            <Select
              name="pays"
              value={paysOptions.find(option => option.value === tier.pays)}
              onChange={handleSelectChange}
              options={paysOptions}
              isSearchable
            />
          </div>

          <div className="form-group">
            <label>Observations</label>
            <textarea
              name="observations"
              value={tier.observations}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Banques</label>
            <Select
              name="banques"
              value={tier.banques}
              onChange={handleMultiSelectChange}
              options={banquesOptions}
              isMulti
              isSearchable
            />
          </div>

          <button onClick={handleClick}>Submit</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateTier;
