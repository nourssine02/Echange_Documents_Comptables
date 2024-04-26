import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const UpdateTier = () => {
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
    observations: "",
  });

  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:5000/tiers/${id}`, tier)
      .then((res) => navigate("/tiers"))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    axios
      .get(`http://localhost:5000/tiers/${id}`)
      .then((res) => {
        const data = res.data[0];
        setTier({
          code_tiers: data.code_tiers,
          date_creation: data.date_creation,
          type: data.type,
          identite: data.identite,
          MF_CIN: data["MF/CIN"],
          tel: data.tel,
          email: data.email,
          adresse: data.adresse,
          observations: data.observations,
        });
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleCancel = () => {
    navigate("/tiers");
  };

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <div className="card">
          <div className="card-body">
            <h1>Modifier un Tier</h1>
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
                      value={tier?.code_tiers ?? ""}
                      onChange={(e) =>
                        setTier({ ...tier, code_tiers: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Date de Création:</label>
                    <input
                      type="date"
                      className="form-control"
                      name="date_creation"
                      value={tier?.date_creation ?? ""}
                      onChange={(e) =>
                        setTier({ ...tier, date_creation: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Type:</label>
                    <select
                      className="form-control"
                      name="type"
                      onChange={(e) =>
                        setTier({ ...tier, type: e.target.value })
                      }
                    >
                      <option value={tier?.type ?? ""}>
                        {tier?.type ?? ""}
                      </option>
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
                      value={tier?.identite ?? ""}
                      onChange={(e) =>
                        setTier({ ...tier, identite: e.target.value })
                      }
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
                      value={tier?.MF_CIN ?? ""}
                      onChange={(e) =>
                        setTier({ ...tier, MF_CIN: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Telephone :</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="tel"
                      value={tier?.tel ?? ""}
                      onChange={(e) =>
                        setTier({ ...tier, tel: e.target.value })
                      }
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
                      value={tier?.email ?? ""}
                      onChange={(e) =>
                        setTier({ ...tier, email: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Adresse:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="adresse"
                      value={tier?.adresse ?? ""}
                      onChange={(e) =>
                        setTier({ ...tier, adresse: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Observations:</label>
                    <textarea
                      className="form-control"
                      name="observations"
                      onChange={(e) =>
                        setTier({ ...tier, observations: e.target.value })
                      }
                      value={tier?.observations ?? ""}
                      rows={5}
                      cols={50}
                    />
                  </div>
                </div>
              </div>
              <div
                className="button d-flex align-items-center"
                style={{ gap: "10px" }}
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

export default UpdateTier;
