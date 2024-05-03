import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [entrepriseCodes, setEntrepriseCodes] = useState([]);

  const [userData, setUserData] = useState({
    code_entreprise: "",
    code_user: "",
    identite: "",
    position: "",
    tel: "",
    email: "",
    mot_de_passe: "",
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
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    let formValid = true;
    const newErrors = { ...errors };

    if (!userData.code_user) {
      formValid = false;
      newErrors.code_user = "Code Utilisateur is required";
    } else {
      newErrors.code_user = "";
    }

    if (!userData.identite) {
      formValid = false;
      newErrors.identite = "Identite is required";
    } else {
      newErrors.identite = "";
    }

    if (!userData.position) {
      formValid = false;
      newErrors.position = "Position is required";
    } else {
      newErrors.position = "";
    }

    if (!userData.tel) {
      formValid = false;
      newErrors.tel = "Telephone is required";
    } else {
      newErrors.tel = "";
    }

    if (!userData.email) {
      formValid = false;
      newErrors.email = "Email is required";
    } else {
      newErrors.email = "";
    }

    if (!userData.code_entreprise) {
      formValid = false;
      newErrors.code_entreprise = "Code Entreprise is required";
    } else {
      newErrors.code_entreprise = "";
    }

    if (!userData.mot_de_passe) {
      formValid = false;
      newErrors.mot_de_passe = "Mot de Passe is required";
    } else {
      newErrors.mot_de_passe = "";
    }

    if (!formValid) {
      setErrors(newErrors);
      return;
    }

    try {
      await axios.post("http://localhost:5000/register", userData);
      navigate("/login");
    } catch (error) {
      console.error("Erreur :", error);
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
                  <div className="form-row">
                    <div className="col">
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          name="code_user"
                          onChange={handleChange}
                          placeholder="Code Utilisateur"
                        />
                        {errors.code_user && (
                          <div className="error" style={{ color: "red" }}>
                            {errors.code_user}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          name="identite"
                          onChange={handleChange}
                          placeholder="Identite"
                        />
                        {errors.identite && (
                          <div className="error" style={{ color: "red" }}>
                            {errors.identite}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="col">
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control form-control-lg"
                          name="position"
                          onChange={handleChange}
                          placeholder="Position"
                        />
                        {errors.position && (
                          <div className="error" style={{ color: "red" }}>
                            {errors.position}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group">
                        <input
                          type="tel"
                          className="form-control form-control-lg"
                          name="tel"
                          onChange={handleChange}
                          placeholder="Telephone"
                        />
                        {errors.tel && (
                          <div className="error" style={{ color: "red" }}>
                            {errors.tel}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      name="email"
                      onChange={handleChange}
                      placeholder="Email"
                    />
                    {errors.email && (
                      <div className="error" style={{ color: "red" }}>
                        {errors.email}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <select
                      className="form-control form-control-lg"
                      name="code_entreprise"
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
                      <div className="error" style={{ color: "red" }}>
                        {errors.code_entreprise}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      name="mot_de_passe"
                      onChange={handleChange}
                      placeholder="Mot de Passe"
                    />
                     {errors.mot_de_passe && (
                      <div className="error" style={{ color: "red" }}>
                        {errors.mot_de_passe}
                      </div>
                    )}
                  </div>

                  <div className="mt-3">
                    <button
                      className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                      type="submit"
                      href="/register"
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
