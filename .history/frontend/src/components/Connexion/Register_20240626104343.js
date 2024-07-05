import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [entrepriseCodes, setEntrepriseCodes] = useState([]);
  const [identites, setIdentites] = useState([]);
  const [userData, setUserData] = useState({
    code_entreprise: "",
    code_user: "",
    identite: "",
    position: "",
    tel: "",
    email: "",
    mot_de_passe: "",
    role: "",
  });
  const [errors, setErrors] = useState({
    code_entreprise: "",
    code_user: "",
    identite: "",
    position: "",
    tel: "",
    email: "",
    mot_de_passe: "",
  });
  const [serverError, setServerError] = useState("");
  const [inputValidity, setInputValidity] = useState({
    code_user: false,
    identite: false,
    position: false,
    tel: false,
    email: false,
    mot_de_passe: false,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "role" && value === "comptable") {
      setUserData({ ...userData, [name]: value, code_entreprise: "" });
    } else {
      setUserData({ ...userData, [name]: value });
    }
  };

  const validateInputs = () => {
    const newInputValidity = { ...inputValidity };

    Object.keys(userData).forEach((key) => {
      switch (key) {
        case "code_user":
          newInputValidity[key] = userData[key] !== "";
          break;
        case "identite":
          newInputValidity[key] =
            userData[key] !== "" &&
            !identites.some((item) => item.identite === userData[key]);
          break;
        case "position":
          newInputValidity[key] = userData[key] !== "";
          break;
        case "tel":
          newInputValidity[key] = /^\d{8}$/.test(userData[key]);
          break;
        case "email":
          newInputValidity[key] = /\S+@\S+\.\S+/.test(userData[key]);
          break;
        case "mot_de_passe":
          newInputValidity[key] = userData[key].length >= 4;
          break;
        default:
          break;
      }
    });

    setInputValidity(newInputValidity);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs before submission
    validateInputs();

    // Check if all inputs are valid
    if (Object.values(inputValidity).every((valid) => valid)) {
      try {
        await axios.post("http://localhost:5000/register", userData);
        navigate("/");
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.sqlMessage
        ) {
          setServerError(error.response.data.sqlMessage);
        } else {
          console.error("Erreur :", error);
        }
      }
    }
  };

  useEffect(() => {
    const fetchEntrepriseCodes = async () => {
      try {
        const res = await axios.get("http://localhost:5000/code_entreprises");
        setEntrepriseCodes(res.data);
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchEntrepriseCodes();
  }, []);

  useEffect(() => {
    const fetchIdentites = async () => {
      try {
        const res = await axios.get("http://localhost:5000/identite");
        setIdentites(res.data);
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchIdentites();
  }, []);

  return (
    <div className="container-scroller">
      <div className="container-fluid page-body-wrapper full-page-wrapper">
        <div className="content-wrapper d-flex align-items-center auth px-0">
          <div className="row w-100 mx-0">
            <div className="col-lg-6 mx-auto">
              <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                <div className="brand-logo">
                  <img src="assets/images/logo-compta.png" alt="logo" />
                </div>
                <h4>New here?</h4>
                <h6 className="font-weight-light">
                  Signing up is easy. It only takes a few steps
                </h6>
                <form className="pt-3" onSubmit={handleSubmit}>
                  {serverError && (
                    <div className="alert alert-danger">{serverError}</div>
                  )}
                  <div className="form-row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <input
                          type="text"
                          className={`form-control form-control-lg ${
                            inputValidity.code_user
                              ? "is-valid"
                              : errors.code_user
                              ? "is-invalid"
                              : ""
                          }`}
                          name="code_user"
                          value={userData.code_user}
                          onChange={handleChange}
                          placeholder="Code Utilisateur"
                        />
                        {errors.code_user && (
                          <div className="invalid-feedback">
                            {errors.code_user}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <input
                          type="text"
                          className={`form-control form-control-lg ${
                            inputValidity.identite
                              ? "is-valid"
                              : errors.identite
                              ? "is-invalid"
                              : ""
                          }`}
                          name="identite"
                          value={userData.identite}
                          onChange={handleChange}
                          placeholder="Identite"
                        />
                        {errors.identite && (
                          <div className="invalid-feedback">
                            {errors.identite}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <input
                          type="text"
                          className={`form-control form-control-lg ${
                            inputValidity.position
                              ? "is-valid"
                              : errors.position
                              ? "is-invalid"
                              : ""
                          }`}
                          name="position"
                          value={userData.position}
                          onChange={handleChange}
                          placeholder="Position"
                        />
                        {errors.position && (
                          <div className="invalid-feedback">
                            {errors.position}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <input
                          type="tel"
                          className={`form-control form-control-lg ${
                            inputValidity.tel
                              ? "is-valid"
                              : errors.tel
                              ? "is-invalid"
                              : ""
                          }`}
                          name="tel"
                          value={userData.tel}
                          onChange={handleChange}
                          placeholder="Telephone"
                        />
                        {errors.tel && (
                          <div className="invalid-feedback">{errors.tel}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <input
                          type="email"
                          className={`form-control form-control-lg ${
                            inputValidity.email
                              ? "is-valid"
                              : errors.email
                              ? "is-invalid"
                              : ""
                          }`}
                          name="email"
                          value={userData.email}
                          onChange={handleChange}
                          placeholder="Email"
                        />
                        {errors.email && (
                          <div className="invalid-feedback">{errors.email}</div>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <select
                          style={{ color: "black" }}
                          className={`form-control ${
                            inputValidity.role
                              ? "is-valid"
                              : errors.role
                              ? "is-invalid"
                              : ""
                          }`}
                          name="role"
                          value={userData.role}
                          onChange={handleChange}
                        >
                          <option value="">Sélectionnez le role...</option>
                          <option value="comptable">Comptable</option>
                          <option value="client">Client</option>
                        </select>
                        {errors.role && (
                          <div className="invalid-feedback">{errors.role}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {userData.role === "client" && (
                    <div className="form-group">
                      <select
                        className={`form-control form-control-lg ${
                          inputValidity.code_entreprise
                            ? "is-valid"
                            : errors.code_entreprise
                            ? "is-invalid"
                            : ""
                        }`}
                        style={{ color: "black" }}
                        name="code_entreprise"
                        value={userData.code_entreprise}
                        onChange={handleChange}
                      >
                        <option value="" style={{ color: "gray" }}>
                          Code Entreprise
                        </option>
                        {entrepriseCodes.map((entrepriseCode) => (
                          <option
                            key={entrepriseCode.code_entreprise}
                            value={entrepriseCode.code_entreprise}
                            style={{ color: "black" }}
                          >
                            {entrepriseCode.code_entreprise}
                          </option>
                        ))}
                      </select>
                      {errors.code_entreprise && (
                        <div className="invalid-feedback">
                          {errors.code_entreprise}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="form-group">
                    <input
                      type="password"
                      className={`form-control form-control-lg ${
                        inputValidity.mot_de_passe
                          ? "is-valid"
                          : errors.mot_de_passe
                          ? "is-invalid"
                          : ""
                      }`}
                      name="mot_de_passe"
                      value={userData.mot_de_passe}
                      onChange={handleChange}
                      placeholder="Mot de Passe"
                    />
                    {errors.mot_de_passe && (
                      <div className="invalid-feedback">
                        {errors.mot_de_passe}
                      </div>
                    )}
                  </div>

                  <div className="mt-3">
                    <button
                      className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                      type="submit"
                    >
                      SIGN UP
                    </button>
                  </div>

                  <div className="text-center mt-4 font-weight-light">
                    Already have an account?{" "}
                    <a href="/" className="text-primary">
                      Login
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
