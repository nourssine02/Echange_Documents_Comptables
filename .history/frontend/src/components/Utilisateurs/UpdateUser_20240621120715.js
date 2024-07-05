import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import CryptoJS from "crypto-js";

const UpdateUser = ({ isSidebarOpen }) => {
  const { id } = useParams();

  const [user, setUser] = useState({
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

  const handleClick = async (e) => {
    e.preventDefault();
    if (!id) {
      console.log("ID de l'utilisateur non valide");
      return;
    }
    axios
      .put(`http://localhost:5000/users/${id}`, user)
      .then((res) => {
        alert("Utilisateur mis à jour avec succès.");
        navigate("/users");
      })
      .catch((err) => console.log(err));
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
    if (!id) {
      console.log("ID de l'utilisateur non valide");
      return;
    }
    axios
      .get(`http://localhost:5000/users/${id}`)
      .then((res) => {
        const data = res.data[0];
        console.log("Data from API:", data); // Log the data from API
        const decryptedPassword = CryptoJS.AES.decrypt(data.mot_de_passe, "MY_SECRET_KEY_WAS_ABCD1234").toString(CryptoJS.enc.Utf8);
        console.log("Decrypted Password:", decryptedPassword); // Log the decrypted password
        setUser({
          code_entreprise: data.code_entreprise,
          code_user: data.code_user,
          identite: data.identite,
          position: data.position,
          tel: data.tel,
          email: data.email,
          mot_de_passe: decryptedPassword,
          role: data.role,
        });
        console.log("User State Updated:", {
          code_entreprise: data.code_entreprise,
          code_user: data.code_user,
          identite: data.identite,
          position: data.position,
          tel: data.tel,
          email: data.email,
          mot_de_passe: decryptedPassword,
          role: data.role,
        }); // Log the updated user state
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleCancel = () => {
    navigate("/users");
  };

  return (
    <>
      <div className="main-panel">
        <div className={`content-wrapper ${isSidebarOpen ? 'shifted' : ''}`}>
          <div className="card">
            <div className="card-body">
              <h1 className="text-center">Modifier un Utilisateur</h1>
              <br />
              <form className="forms-sample">
                <div className="row">
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Code Entreprise:</label>
                      <select
                        className="form-control form-control-lg"
                        name="code_entreprise"
                        style={{ color: "black" }}
                        value={user.code_entreprise}
                        onChange={(e) =>
                          setUser({ ...user, code_entreprise: e.target.value })
                        }
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
                        placeholder="Code Utilisateur"
                        value={user.code_user}
                        onChange={(e) =>
                          setUser({ ...user, code_user: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Role:</label>
                      <select
                        style={{ color: "black" }}
                        className="form-control"
                        name="role"
                        value={user.role}
                        onChange={(e) =>
                          setUser({ ...user, role: e.target.value })
                        }
                      >
                        <option value="">Sélectionnez...</option>
                        <option value="super_admin">Super Admin</option>
                        <option value="comptable">Comptable</option>
                        <option value="client">Client</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Identité:</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Identité"
                        value={user.identite}
                        onChange={(e) =>
                          setUser({ ...user, identite: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Position:</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Position"
                        value={user.position}
                        onChange={(e) =>
                          setUser({ ...user, position: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Mot de passe:</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Mot de passe"
                        value={user.mot_de_passe}
                        onChange={(e) =>
                          setUser({ ...user, mot_de_passe: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-group">
                      <label>Téléphone:</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Téléphone"
                        value={user.tel}
                        onChange={(e) =>
                          setUser({ ...user, tel: e.target.value })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label>Email:</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        value={user.email}
                        onChange={(e) =>
                          setUser({ ...user, email: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
                <br />
                <div className="d-flex justify-content-center">
                  <button
                    type="submit"
                    className="btn btn-primary mr-2"
                    onClick={handleClick}
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
    </>
  );
};

export default UpdateUser;

//get utilisateur by id
app.get("/users/:id", (req, res) => {
  const userID = req.params.id;
  const q = "SELECT * FROM utilisateurs WHERE id = ? ";

  db.query(q, [userID], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});
