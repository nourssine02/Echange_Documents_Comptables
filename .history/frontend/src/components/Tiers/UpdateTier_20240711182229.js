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

  const [banquesOptions, setBanquesOptions] = useState([
    { value: "Al Baraka Bank", label: "Al Baraka Bank" },
    { value: "AMEN BANK", label: "AMEN BANK" },
    { value: "ARAB TUNISIAN BANK", label: "ARAB TUNISIAN BANK" },
    { value: "ATTIJARI BANK", label: "ATTIJARI BANK" },
    { value: "BANQUE DE TUNISIE", label: "BANQUE DE TUNISIE" },
    { value: "BANQUE INTERNATIONALE ARABE DE TUNISIE (BIAT)", label: "BANQUE INTERNATIONALE ARABE DE TUNISIE (BIAT)" },
    { value: "BH BANK", label: "BH BANK" },
    { value: "BANQUE ZITOUNA", label: "BANQUE ZITOUNA" },
    { value: "UNION INTERNATIONALE DE BANQUES", label: "UNION INTERNATIONALE DE BANQUES" },
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTier((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
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
      return acc && (key === 'observations' || !errors[key]);
    }, true);

    // Vérifier s'il y a des erreurs
    const hasErrors = Object.values(errors).some((error) => error !== "");

    if (formValid && !hasErrors) {
      try {
        await axios.put(`http://localhost:5000/tiers/${id}`, { ...tier });
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
        const data = res.data[0];
        setTier({
          code_tiers: data.code_tiers,
          date_creation: data.date_creation,
          type: data.type,
          identite: data.identite,
          MF_CIN: data["MF/CIN"],
          tel: data.tel,
          email: data.email,
          adresse: data.adresse,
          ville: data.ville.split(', ')[0],
          pays: data.pays,
          observations: data.observations,
          autreType: data.autreType,
          banques: data.banques.map((banque) => ({ value: banque, label: banque })),
        });
      })
      .catch((err) => console.log(err));
  }, [id]);

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
          <form className="forms-sample">
            <div className="row">
              <div className="col-md-4">
                <div className="form-group">
                  <label>Date de Création:</label>
                  <input
                    type="date"
                    className={`form-control ${
                      errors.date_creation && "is-invalid"
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
                      errors.code_tiers && "is-invalid"
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
                    className={`form-control ${errors.email && "is-invalid"}`}
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
                    className={`form-control ${errors.adresse && "is-invalid"}`}
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
                  <label>Observations:</label>
                  <textarea
                    className="form-control"
                    name="observations"
                    onChange={handleChange}
                    placeholder="Observations"
                  />
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-group">
                  <label>Type:</label>
                  <select
                    style={{ color: "black" }}
                    className={`form-control ${errors.type && "is-invalid"}`}
                    name="type"
                    onChange={handleChange}
                    value={tier.type}
                  >
                    <option value="">Sélectionnez...</option>
                    <option value="fournisseur">Fournisseur</option>
                    <option value="client">Client</option>
                    <option value="personnel">Personnel</option>
                    <option value="associe">Associé</option>
                    <option value="autre">Autre</option>
                  </select>
                  {errors.type && (
                    <div className="invalid-feedback">{errors.type}</div>
                  )}
                </div>

                <div className="form-group">
                  <label>MF / CIN:</label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.MF_CIN && "is-invalid"
                    }`}
                    name="MF_CIN"
                    onChange={handleChange}
                    placeholder="MF / CIN"
                  />
                  {errors.MF_CIN && (
                    <div className="invalid-feedback">{errors.MF_CIN}</div>
                  )}
                </div>

                <div className="form-group">
                  <label>Identité:</label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.identite && "is-invalid"
                    }`}
                    name="identite"
                    onChange={handleChange}
                    placeholder="Identité"
                  />
                  {errors.identite && (
                    <div className="invalid-feedback">{errors.identite}</div>
                  )}
                </div>

                <div className="form-group">
                  <label>Ville:</label>
                  <select
                    className="form-control"
                    name="ville"
                    onChange={handleChange}
                    style={{ color: "black" }}
                  >
                    <option value="">Sélectionnez une Ville...</option>
                    {villesTunisie.map((ville) => (
                      <option key={ville} value={ville}>
                        {ville}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-group">
                  <label>Autre Type:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="autreType"
                    onChange={handleChange}
                    placeholder="Autre Type"
                    disabled={tier.type !== "autre"}
                  />
                </div>

                <div className="form-group">
                  <label>Téléphone:</label>
                  <input
                    type="text"
                    className={`form-control ${errors.tel && "is-invalid"}`}
                    name="tel"
                    onChange={handleChange}
                    placeholder="Téléphone"
                  />
                  {errors.tel && (
                    <div className="invalid-feedback">{errors.tel}</div>
                  )}
                </div>

                <div className="form-group">
                  <label>Banque:</label>
                  <Select
                    isMulti
                    options={banquesOptions}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={handleMultiSelectChange}
                    value={tier.banques}

                  />
                </div>

                <div className="form-group">
                  <label>Pays:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="pays"
                    onChange={handleChange}
                    placeholder="Pays"
                  />
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-center">
            <button className="btn btn-primary mr-2" onClick={handleClick}>
              Ajouter
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

export default UpdateTier;
