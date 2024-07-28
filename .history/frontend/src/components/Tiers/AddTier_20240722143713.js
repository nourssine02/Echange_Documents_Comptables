import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Connexion/UserProvider";
import Select from "react-select";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddTier = ({ isSidebarOpen }) => {
  const { user } = useContext(UserContext);

  const [tier, setTier] = useState({
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

  const [errors, setErrors] = useState({});
  const [banquesOptions, setBanquesOptions] = useState([]);
  const [alert, setAlert] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/banques");
        setBanquesOptions(response.data.map(banque => ({ value: banque.id, label: banque.nom })));
      } catch (error) {
        console.error("Error fetching banques:", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTier((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleMultiSelectChange = (selectedOptions) => {
    setTier((prev) => ({
      ...prev,
      banques: selectedOptions.map(banque => ({ value: banque.value }))
    }));
  }

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "code_tiers":
        error = value ? "" : "Code Tiers est obligatoire";
        break;
      case "identite":
        error = value ? "" : "Identité est obligatoire";
        break;
      case "type":
        error = value ? "" : "Type est obligatoire";
        break;
      case "autreType":
        error = tier.type === "autre" && !value ? "Autre Type est obligatoire" : "";
        break;
      case "MF_CIN":
        error = value ? "" : "MF/CIN est obligatoire";
        break;
      case "tel":
        error = value ? "" : "Téléphone est obligatoire";
        break;
      case "email":
        error = value && /\S+@\S+\.\S+/.test(value) ? "" : "Email est invalide";
        break;
      case "adresse":
        error = value ? "" : "Adresse est obligatoire";
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

    setIsSubmitting(true);

    Object.keys(tier).forEach((key) => validateField(key, tier[key]));

    const hasErrors = Object.values(errors).some((error) => error !== "");

    if (!hasErrors) {
      const axiosInstance = axiosWithAuth();

      try {
        await axiosInstance.post("/tiers", tier);

        toast.success("Tier ajouté avec succès !");
        setAlert({
          type: "success",
          message: "Tier ajouté avec succès",
        });

        setTimeout(() => {
          navigate("/tiers");
        }, 2000);
      } catch (err) {
        console.log(err);
        setAlert({
          type: "danger",
          message: "Erreur lors de l'ajout du tier.",
        });
      }
    }
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    navigate("/tiers");
  };

  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? "shifted" : ""}`}>
        <div className="card">
          <div className="card-body">
            <h1 className="text-center" style={{ fontSize: "35px" }}>
              Ajouter un nouveau tiers
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
                    <label>Code Tiers:</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.code_tiers && "is-invalid"
                      }`}
                      name="code_tiers"
                      onChange={handleChange}
                      value={tier.code_tiers}
                    />
                    {errors.code_tiers && (
                      <div className="invalid-feedback">
                        {errors.code_tiers}
                      </div>
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
                      value={tier.identite}
                    />
                    {errors.identite && (
                      <div className="invalid-feedback">
                        {errors.identite}
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <label>Type:</label>
                    <select
                      style={{ color: "black" }}
                      className={`form-control ${
                        errors.type && "is-invalid"
                      }`}
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
                      <div className="invalid-feedback">
                        {errors.type}
                      </div>
                    )}
                  </div>

                  {tier.type === "autre" && (
                    <div className="form-group">
                      <label>Autre Type:</label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.autreType && "is-invalid"
                        }`}
                        name="autreType"
                        onChange={handleChange}
                        value={tier.autreType}
                      />
                      {errors.autreType && (
                        <div className="invalid-feedback">
                          {errors.autreType}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <label>MF/CIN:</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.MF_CIN && "is-invalid"
                      }`}
                      name="MF_CIN"
                      onChange={handleChange}
                      value={tier.MF_CIN}
                    />
                    {errors.MF_CIN && (
                      <div className="invalid-feedback">
                        {errors.MF_CIN}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Téléphone:</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.tel && "is-invalid"
                      }`}
                      name="tel"
                      onChange={handleChange}
                      value={tier.tel}
                    />
                    {errors.tel && (
                      <div className="invalid-feedback">
                        {errors.tel}
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <label>Email:</label>
                    <input
                      type="email"
                      className={`form-control ${
                        errors.email && "is-invalid"
                      }`}
                      name="email"
                      onChange={handleChange}
                      value={tier.email}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">
                        {errors.email}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Adresse:</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.adresse && "is-invalid"
                      }`}
                      name="adresse"
                      onChange={handleChange}
                      value={tier.adresse}
                    />
                    {errors.adresse && (
                      <div className="invalid-feedback">
                        {errors.adresse}
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <label>Banques:</label>
                    <Select
                      isMulti
                      name="banques"
                      options={banquesOptions}
                      onChange={handleMultiSelectChange}
                      value={banquesOptions.filter(option =>
                        tier.banques.some(banque => banque.value === option.value)
                      )}
                    />
                  </div>
                </div>
              </div>
              <br />
              <div className="text-center">
                <button
                  className="btn btn-primary mr-2"
                  onClick={handleClick}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Soumission..." : "Ajouter"}
                </button>
                <Button
                  className="btn btn-secondary"
                  onClick={handleCancel}
                >
                  Annuler
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTier;
