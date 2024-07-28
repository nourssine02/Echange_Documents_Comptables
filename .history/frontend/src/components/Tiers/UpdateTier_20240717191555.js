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
    banques: "",
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


  const handleCancel = () => {
    navigate("/tiers");
  };

  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? "shifted" : ""}`}>
        <div className="card">
          <div className="card-body">
            <h1 className="text-center">Modifier un Tier</h1>
            <br />
            <form className="forms-sample"  onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Date de Création:</label>
                    <input
                      type="date"
                      className={`form-control ${errors.date_creation && "is-invalid"}`}
                      name="date_creation"
                      onChange={handleChange}
                      value={tier.date_creation}
                    />
                    {errors.date_creation && (
                      <div className="invalid-feedback">{errors.date_creation}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Code Tiers:</label>
                    <input
                      type="text"
                      className={`form-control ${errors.code_tiers && "is-invalid"}`}
                      name="code_tiers"
                      onChange={handleChange}
                      placeholder="Code Tiers"
                      value={tier.code_tiers}
                    />
                    {errors.code_tiers && (
                      <div className="invalid-feedback">{errors.code_tiers}</div>
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
                      value={tier.observations}
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
                      <option value="">Sélectionnez un Type...</option>
                      <option value="client">Client</option>
                      <option value="fournisseur">Fournisseur</option>
                      <option value="autre">Autre</option>
                    </select>
                    {errors.type && (
                      <div className="invalid-feedback">{errors.type}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>MF/CIN:</label>
                    <input
                      type="text"
                      className={`form-control ${errors.MF_CIN && "is-invalid"}`}
                      name="MF_CIN"
                      onChange={handleChange}
                      placeholder="MF / CIN"
                      value={tier.MF_CIN}
                    />
                    {errors.MF_CIN && (
                      <div className="invalid-feedback">{errors.MF_CIN}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Identité:</label>
                    <input
                      type="text"
                      className={`form-control ${errors.identite && "is-invalid"}`}
                      name="identite"
                      onChange={handleChange}
                      placeholder="Identité"
                      value={tier.identite}
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
                      value={tier.ville}
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
                      value={tier.autreType}
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
                      value={tier.tel}
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
                    <Select
                      options={paysOptions}
                      classNamePrefix="select"
                      name="pays"
                      onChange={handleSelectChange}
                      value={paysOptions.find((option) => option.value === tier.pays)}
                    />
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-center">
                <button className="btn btn-primary mr-2" onClick={handleSubmit} type="submit">
                  Modifier
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
