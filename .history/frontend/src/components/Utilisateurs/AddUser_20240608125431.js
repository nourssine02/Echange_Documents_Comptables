import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddUser = ({isSidebarOpen}) => {
  const [users, setUsers] = useState({
    code_entreprise: "",
    code_user: "",
    identite: "",
    position: "",
    tel: "",
    email: "",
    mot_de_passe: "",
    role: ""
  });
  const [entrepriseCodes, setEntrepriseCodes] = useState([]);

  const navigate = useNavigate();
  const handleChange = (e) => {
    setUsers((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCancel = () => {
    navigate("/users");
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

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/users", users);
      navigate("/users");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? 'shifted' : ''}`}>
      <div className="card">
          <div className="card-body">
            <h1>Ajouter un Utilisateur</h1>
            <br></br>
            <form className="forms-sample">
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Code Entreprise:</label>

                    <select
                      className="form-control form-control-lg"
                      name="code_entreprise"
                      onChange={handleChange}
                    >
                      <option value="" style={{ color: "black" }}>
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
                  </div>

                  <div className="form-group">
                    <label>Code Utilisateur:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="code_user"
                      onChange={handleChange}
                      placeholder="Code Utilisateur"
                    />
                  </div>

                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Identite :</label>
                    <input
                      type="text"
                      className="form-control"
                      name="identite"
                      onChange={handleChange}
                      placeholder="Identite"
                    />
                  </div>

                  <div className="form-group">
                    <label>Position :</label>
                    <input
                      type="text"
                      className="form-control"
                      name="position"
                      onChange={handleChange}
                      placeholder="Position"
                    />
                  </div>

                </div>

                <div className="col-md-6">
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

                  <div className="form-group">
                    <label>Email :</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      onChange={handleChange}
                      placeholder="Email"
                    />
                  </div>

                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label>Role:</label>
                    <select
                      style={{ color: "black" }}
                      className="form-control"
                      name="role"
                      onChange={handleChange}
                    >
                      <option value="">Sélectionnez...</option>
                      <option value="super_admin">Super Admin</option>
                      <option value="comptable">Comptable</option>
                      <option value="client">Client</option>

                    </select>
                  </div>

                  <div className="form-group">
                    <label>Mot de Passe :</label>
                    <input
                      type="password"
                      className="form-control"
                      name="mot_de_passe"
                      onChange={handleChange}
                      placeholder="Mot de passe"
                    />
                  </div>
                </div>
              </div>
              <br />
              <div
                className="d-flex align-items-center"
              >
                <button
                  type="submit"
                  className="btn btn-primary mr-2"
                  onClick={handleClick}
                  style={{ marginBottom: "5px" }}
                >
                  Submit
                </button>
                &nbsp; &nbsp;
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

export default AddUser;
