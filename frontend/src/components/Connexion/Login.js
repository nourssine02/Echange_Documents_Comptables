import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [identite , setIdentite] =useState('');
  const [password , setPassword] = useState('');

  const navigate = useNavigate();

  function handleSubmit(event){
    event.preventDefault();
    try {
      axios.post("http://localhost:5000/login",{identite, password});
      navigate("/");
    } catch (error) {
      console.error("Erreur :", error);
    }

  }
  return (
    <div className="container-fluid page-body-wrapper full-page-wrapper">
      <div className="content-wrapper d-flex align-items-center auth px-0">
        <div className="row w-100 mx-0">
          <div className="col-lg-4 mx-auto">
            <div className="auth-form-light text-left py-5 px-4 px-sm-5">
              <div className="brand-logo">
                <img src="assets/images/logo-compta.png" alt="logo" />
              </div>
              <h4>Hello! let's get started</h4>
              <h6 className="font-weight-light">Sign in to continue.</h6>
              <form className="pt-3" onSubmit={handleSubmit}>
                <div className="form-group">
                  <input type="text" className="form-control form-control-lg"  placeholder="Identite" 
                  onChange={e => setIdentite(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <input type="password" className="form-control form-control-lg"  placeholder="Mot de Passe" 
                   onChange={e => setPassword(e.target.value)}
                  />
                </div>
                 <div className="mt-3">
                    <button
                      className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                      type="submit"
                    >
                      SIGN IN
                    </button>
                  </div>

                <div className="my-3 d-flex justify-content-between align-items-center">
                  <a href="/forget_pass" className="auth-link text-black">Forgot password?</a>
                </div>
                <div className="text-center mt-4 font-weight-light">
                  Don't have an account? <a href="/register" className="text-primary">Create</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
