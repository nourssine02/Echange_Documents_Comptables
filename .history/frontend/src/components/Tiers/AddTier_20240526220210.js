import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddTier = () => {
  const [tier, setTier] = useState({
    code_tiers: "",
    date_creation: new Date().toISOString().split("T")[0],
    type: "",
    identite: "",
    MF_CIN: "",
    tel: "",
    email: "",
    adresse: "",
    observations: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setTier((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/tiers", tier);
      navigate("/tiers");
    } catch (err) {
      console.log(err);
    }
  };

  const handleCancel = () => {
    navigate("/tiers");
  };

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <div className="card">
          <div className="card-body">
            <h1>Ajouter un Tier</h1>
            <br />
            <form className="forms-sample">
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Code Tiers:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="code_tiers"
                      onChange={handleChange}
                      placeholder="Code Tiers"
                    />
                  </div>

                  <div className="form-group">
                    <label>Date de Création:</label>
                    <input
                      type="date"
                      className="form-control"
                      name="date_creation"
                      onChange={handleChange}
                      value={tier.date_creation}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Type:</label>
                    <select
                      style={{ color: "black" }}  
                      className="form-control"
                      name="type"
                      onChange={handleChange}
                    >
                      <option value="">Sélectionnez...</option>
                      <option value="fournisseur">Fournisseur</option>
                      <option value="client">Client</option>
                      <option value="personnel">Personnel</option>
                      <option value="associe">Associé</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Identité:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="identite"
                      onChange={handleChange}
                      placeholder="Identité"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>MF / CIN:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="MF_CIN"
                      onChange={handleChange}
                      placeholder="MF/CIN"
                    />
                  </div>

                  <div className="form-group">
                    <label>Telephone :</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="tel"
                      onChange={handleChange}
                      placeholder="Telephone"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Email:</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      onChange={handleChange}
                      placeholder="Email"
                    />
                  </div>

                  <div className="form-group">
                    <label>Adresse:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="adresse"
                      onChange={handleChange}
                      placeholder="Adresse"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Observations:</label>
                    <textarea
                      className="form-control"
                      name="observations"
                      onChange={handleChange}
                      placeholder="Entrez vos observations ici..."
                      rows={5}
                      cols={50}
                    />
                  </div>
                </div>
              </div>
              <div
                className="button d-flex align-items-center"
                style={{ gap: "10px" , marg}}
              >
                <button
                  type="submit"
                  className="btn btn-primary mr-2"
                  onClick={handleClick}
                  style={{ marginBottom: "5px" }}
                >
                  Submit
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

export default AddTier;
