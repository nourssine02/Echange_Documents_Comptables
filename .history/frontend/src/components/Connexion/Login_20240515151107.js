import React, { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "./UserProvider";

const Login = () => {
  const { setUser } = useContext(UserContext);
  const [identite, setIdentite] = useState("");
  const [mot_de_passe, setMot_de_passe] = useState("");
  const [token, setToken] = useState('');

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/login",
        {
          identite,
          mot_de_passe,
        }
      );
      const token = response.data.token; // Extraire le token de la réponse
      localStorage.setItem("token", token);
      setUser(response.data.user);
      console.log(response.data.user);
      // Inclure le token dans l'en-tête d'autorisation pour les futures requêtes
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      window.location.href = "/home";
    } catch (error) {
      console.error("Error:", error);
      setError("Les informations d'identification sont incorrectes.");
    }
  };
  

  return (
    <div className="container-fluid page-body-wrapper full-page-wrapper">
      <div className="content-wrapper d-flex align-items-center auth px-0">
        <div className="row w-100 mx-0">
          <div className="col-lg-4 mx-auto">
            <div className="auth-form-light text-left py-5 px-4 px-sm-5">
              <div className="brand-logo">
                <img src="assets/images/logo-compta.png" alt="logo" />
              </div>
              <h4>Hello! Let's get started</h4>
              <h6 className="font-weight-light">Sign in to continue.</h6>
              <form className="pt-3" onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    value={identite}
                    placeholder="Identité"
                    onChange={(e) => setIdentite(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    value={mot_de_passe}
                    placeholder="Mot de Passe"
                    onChange={(e) => setMot_de_passe(e.target.value)}
                  />
                </div>
                {error && <div>{error}</div>}

                <div className="mt-3">
                  <button
                    className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                    type="submit"
                  >
                    SIGN IN
                  </button>
                </div>

                <div className="my-3 d-flex justify-content-between align-items-center">
                  <a href="/forget_pass" className="auth-link text-black">
                    Forgot password?
                  </a>
                </div>

                <div className="text-center mt-4 font-weight-light">
                  Don't have an account?{" "}
                  <a href="/register" className="text-primary">
                    Create
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
