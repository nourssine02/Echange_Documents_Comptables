import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";

const Register = () => {
  const [entrepriseCodes, setEntrepriseCodes] = useState([]);
  const [comptableCodes, setComptableCodes] = useState([]);
  const [identites, setIdentites] = useState([]);
  const [userData, setUserData] = useState({
    code_entreprise: "",
    code_comptable: "",
    code_user: "",
    identite: "",
    position: "",
    tel: "",
    email: "",
    mot_de_passe: "",
    role: "utilisateur", // Role par défaut
  });
  const [errors, setErrors] = useState({});
  const [inputValidity, setInputValidity] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "role" && value === "comptable") {
      setUserData({ ...userData, [name]: value, code_entreprise: "", code_comptable: "" });
    } else {
      setUserData({ ...userData, [name]: value });
    }

    setErrors({ ...errors, [name]: "" });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let valid;
    switch (name) {
      case "code_user":
        valid = value !== "";
        setErrors((prev) => ({ ...prev, code_user: valid ? "" : "Code Utilisateur is required" }));
        break;
      case "identite":
        valid = value !== "" && !identites.find((item) => item.identite === value);
        setErrors((prev) => ({
          ...prev,
          identite: valid ? "" : "Identité déjà existante ou vide",
        }));
        break;
      case "tel":
        valid = /^\d{8}$/.test(value);
        setErrors((prev) => ({ ...prev, tel: valid ? "" : "Telephone must be 8 digits" }));
        break;
      case "email":
        valid = /\S+@\S+\.\S+/.test(value);
        setErrors((prev) => ({ ...prev, email: valid ? "" : "Email must be valid" }));
        break;
      case "mot_de_passe":
        valid = value.length >= 4;
        setErrors((prev) => ({
          ...prev,
          mot_de_passe: valid ? "" : "Mot de Passe must be at least 4 characters",
        }));
        break;
      default:
        break;
    }
    setInputValidity((prev) => ({ ...prev, [name]: valid }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Données envoyées :', userData); // Affiche les données envoyées

    // Valider si le rôle est valide
    if (!["utilisateur", "comptable"].includes(userData.role)) {
        alert("Rôle invalide sélectionné.");
        return;
    }

    // Valider tous les champs avant l'envoi
    Object.keys(userData).forEach((key) => validateField(key, userData[key]));

    console.log('Validation pour chaque champ:', inputValidity); // Afficher l'état de validation des champs

    // Vérifier si tous les champs sont valides avant l'envoi
    if (Object.values(inputValidity).every((valid) => valid)) {
        try {
            console.log("Tentative d'envoi de la requête POST à l'API...");
    
            const response = await axios.post("http://localhost:5000/register", userData);
            
            console.log("Réponse du serveur:", response.data);
    
            alert("Utilisateur ajouté avec succès !");
            setTimeout(() => {
                navigate("/"); // Rediriger après inscription
            }, 2000);
        } catch (error) {
            console.error("Erreur lors de l'inscription:", error.response || error); // Affiche l'erreur complète
            alert("Erreur lors de l'inscription");
        }
    } else {
        alert("Certains champs sont invalides.");
        console.log('Validation échouée. Données non envoyées !');
    }
};





  useEffect(() => {
    const fetchEntrepriseCodes = async () => {
      try {
        const res = await axios.get("http://localhost:5000/code_entreprises");
        setEntrepriseCodes(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchEntrepriseCodes();
  }, []);

  useEffect(() => {
    const fetchComptableCodes = async () => {
      try {
        const res = await axios.get("http://localhost:5000/comptables");
        setComptableCodes(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchComptableCodes();
  }, []);

  useEffect(() => {
    const fetchIdentites = async () => {
      try {
        const res = await axios.get("http://localhost:5000/identite");
        setIdentites(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchIdentites();
  }, []);

  return (
      <div className="container-fluid page-body-wrapper full-page-wrapper">
        <div className="content-wrapper d-flex align-items-center auth px-0 pt-4">
          <div className="row w-100 mx-0">
            <div className="col-lg-6 mx-auto">
              <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                <div className="brand-logo mb-3">
                  <img src="assets/images/logo-compta.png" alt="logo" />
                </div>
                <h4>New here?</h4>
                <h6 className="font-weight-light">Signing up is easy. It only takes a few steps</h6>
                <form className="pt-3" onSubmit={handleSubmit}>

                  {/* Role Selection Dropdown */}
                  <div className="form-group">
                    <label htmlFor="role">Role</label>
                    <select
                        className="form-control"
                        name="role"
                        value={userData.role}
                        onChange={handleChange}
                        style={{color: "black"}}
                    >
                      <option value="utilisateur">Utilisateur</option>
                      <option value="comptable">Comptable</option>
                    </select>
                  </div>

                  {/* Role-Specific Fields */}
                  {userData.role === "utilisateur" && (
                      <div className="form-group">
                        <div className="row">
                          <div className="col-md-6">
                            <input
                                type="text"
                                className={`form-control rounded ${errors.code_user ? "is-invalid" : ""}`}
                                name="code_user"
                                value={userData.code_user}
                                onChange={handleChange}
                                placeholder="Code Utilisateur"
                            />
                            {errors.code_user && <div className="invalid-feedback">{errors.code_user}</div>}
                          </div>
                          <div className="col-md-6">
                            <input
                                type="text"
                                className={`form-control rounded ${errors.identite ? "is-invalid" : ""}`}
                                name="identite"
                                value={userData.identite}
                                onChange={handleChange}
                                placeholder="Identité"
                            />
                            {errors.identite && <div className="invalid-feedback">{errors.identite}</div>}
                          </div>
                          <div className="col-md-6">
                            <input
                                type="text"
                                className={`form-control rounded ${errors.position ? "is-invalid" : ""}`}
                                name="position"
                                value={userData.position}
                                onChange={handleChange}
                                placeholder="Position"
                            />
                            {errors.position && <div className="invalid-feedback">{errors.position}</div>}
                          </div>
                          <div className="col-md-6">
                            <input
                                type="tel"
                                className={`form-control rounded ${errors.tel ? "is-invalid" : ""}`}
                                name="tel"
                                value={userData.tel}
                                onChange={handleChange}
                                placeholder="Téléphone"
                            />
                            {errors.tel && <div className="invalid-feedback">{errors.tel}</div>}
                          </div>
                          <div className="col-md-6">
                            <input
                                type="email"
                                className={`form-control rounded ${errors.email ? "is-invalid" : ""}`}
                                name="email"
                                value={userData.email}
                                onChange={handleChange}
                                placeholder="Email"
                            />
                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                          </div>
                          <div className="col-md-6">
                            <select
                                style={{ color: "black" }}
                                className="form-control rounded"
                                name="code_entreprise"
                                value={userData.code_entreprise}
                                onChange={handleChange}
                            >
                              <option value="">Code Entreprise</option>
                              {entrepriseCodes.map((code, index) => (
                                  <option key={`${code.code_entreprise}-${index}`} value={code.code_entreprise}>
                                    {code.code_entreprise}
                                  </option>
                              ))}
                            </select>
                          </div>
                          <div className="col-md-6">
                            <select
                                className={`form-control rounded ${inputValidity.code_comptable ? "is-valid" : errors.code_comptable ? "is-invalid" : ""}`}
                                style={{ color: "black" }}
                                name="code_comptable"
                                value={userData.code_comptable}
                                onChange={handleChange}
                            >
                              <option value="" style={{ color: "gray" }}>
                                Code Comptable
                              </option>
                              {comptableCodes.map((comptable, index) => (
                                  <option key={`${comptable.code_comptable}-${index}`} value={comptable.code_comptable}>
                                    {`${comptable.identite} - ${comptable.code_user}`}
                                  </option>
                              ))}
                            </select>
                            {errors.code_comptable && <div className="invalid-feedback">{errors.code_comptable}</div>}
                          </div>
                          <div className="col-md-6">
                            <input
                                type="password"
                                className={`form-control rounded ${errors.mot_de_passe ? "is-invalid" : ""}`}
                                name="mot_de_passe"
                                value={userData.mot_de_passe}
                                onChange={handleChange}
                                placeholder="Mot de Passe"
                            />
                            {errors.mot_de_passe && <div className="invalid-feedback">{errors.mot_de_passe}</div>}
                          </div>
                        </div>
                      </div>
                  )}

                  {userData.role === "comptable" && (
                      <div className="form-group">
                        <div className="row">
                          <div className="col-md-6">
                            <input
                                type="text"
                                className={`form-control rounded ${errors.code_user ? "is-invalid" : ""}`}
                                name="code_user"
                                value={userData.code_user}
                                onChange={handleChange}
                                placeholder="Code Comptable"
                                style={{color: "black"}}
                            />
                            {errors.code_user && <div className="invalid-feedback">{errors.code_user}</div>}
                          </div>
                          <div className="col-md-6">
                            <input
                                type="text"
                                className={`form-control rounded ${errors.identite ? "is-invalid" : ""}`}
                                name="identite"
                                value={userData.identite}
                                onChange={handleChange}
                                placeholder="Identité"
                            />
                            {errors.identite && <div className="invalid-feedback">{errors.identite}</div>}
                          </div>
                          <div className="col-md-6">
                            <input
                                type="text"
                                className={`form-control rounded ${errors.position ? "is-invalid" : ""}`}
                                name="position"
                                value={userData.position}
                                onChange={handleChange}
                                placeholder="Position"
                            />
                            {errors.position && <div className="invalid-feedback">{errors.position}</div>}
                          </div>
                          <div className="col-md-6">
                            <input
                                type="tel"
                                className={`form-control rounded ${errors.tel ? "is-invalid" : ""}`}
                                name="tel"
                                value={userData.tel}
                                onChange={handleChange}
                                placeholder="Téléphone"
                            />
                            {errors.tel && <div className="invalid-feedback">{errors.tel}</div>}
                          </div>
                          <div className="col-md-6">
                            <input
                                type="email"
                                className={`form-control rounded ${errors.email ? "is-invalid" : ""}`}
                                name="email"
                                value={userData.email}
                                onChange={handleChange}
                                placeholder="Email"
                            />
                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                          </div>
                          <div className="col-md-6">
                            <input
                                type="password"
                                className={`form-control rounded ${errors.mot_de_passe ? "is-invalid" : ""}`}
                                name="mot_de_passe"
                                value={userData.mot_de_passe}
                                onChange={handleChange}
                                placeholder="Mot de Passe"
                            />
                            {errors.mot_de_passe && <div className="invalid-feedback">{errors.mot_de_passe}</div>}
                          </div>
                        </div>
                      </div>
                  )}

                  <div className="mt-3">
                    <button type="submit" className="btn btn-primary btn-lg btn-block">
                      SIGN UP
                    </button>
                  </div>
                </form>
                <div className="text-center mt-4 font-weight-light">
                  Already have an account? <a href="/" className="text-primary">Login</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Register;
