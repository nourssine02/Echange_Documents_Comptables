import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import Swal from "sweetalert2";

const UpdateTier = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tier, setTier] = useState({
    code_tiers: "",
    date_creation: "",
    type: "",
    identite: "",
    MF_CIN: "",
    tel: "",
    email: "",
    adresse: "",
    ville: "",
    pays: "",
    observations: "",
    autreType: "",
    banques: [], // Array to hold selected bank IDs or values
  });

  useEffect(() => {
    const fetchTier = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/tiers/${id}`);
        const data = response.data;

        if (!data) {
          console.error("Empty response or invalid data structure:", response);
          return;
        }

        setTier((prev) => ({
          ...prev,
          code_tiers: data.code_tiers || "",
          date_creation: data.date_creation
            ? data.date_creation.split("T")[0]
            : "",
          type: data.type || "",
          identite: data.identite || "",
          MF_CIN: data["MF/CIN"] || "",
          tel: data.tel || "",
          email: data.email || "",
          adresse: data.adresse || "",
          ville: data.ville || "",
          pays: data.pays || "",
          observations: data.observations || "",
          autreType: data.autreType || "",
          banques: Array.isArray(data.banques)
            ? data.banques.map((banque) => ({
                value: banque.id,
                label: banque.name,
              })) // Example mapping logic
            : [],
        }));
      } catch (err) {
        console.error("Error fetching tier data:", err);
      }
    };

    fetchTier();
  }, [id]);

  const handleMultiSelectChange = (selectedOptions) => {
    setTier((prev) => ({
      ...prev,
      banques: selectedOptions.map((option) => option.value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `http://localhost:5000/tiers/${id}`,
        tier
      );
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Tier updated successfully!",
      }).then(() => {
        navigate("/tiers");
      });
    } catch (error) {
      console.error("Error updating tier:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error updating tier. Please try again.",
      });
    }
  };

  const handleCancel = () => {
    navigate("/tiers");
  };

  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? "shifted" : ""}`}>
        <div className="card">
          <div className="card-body">
            <h1 className="text-center">Modifier un Tier</h1>
            <br />
            <form className="forms-sample" onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Date de Création:</label>
                    <input
                      type="date"
                      className={`form-control ${
                        errors.date_creation && "is-invalid"
                      }`}
                      name="date_creation"
                      onChange={handleChange}
                      value={tier.date_creation}
                    />
                    {errors.date_creation && (
                      <div className="invalid-feedback">
                        {errors.date_creation}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Code Tiers:</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.code_tiers && "is-invalid"
                      }`}
                      name="code_tiers"
                      onChange={handleChange}
                      placeholder="Code Tiers"
                      value={tier.code_tiers}
                    />
                    {errors.code_tiers && (
                      <div className="invalid-feedback">
                        {errors.code_tiers}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Email:</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email && "is-invalid"}`}
                      name="email"
                      onChange={handleChange}
                      placeholder="Email"
                      value={tier.email}
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
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
                      placeholder="Adresse"
                      value={tier.adresse}
                    />
                    {errors.adresse && (
                      <div className="invalid-feedback">{errors.adresse}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Observations:</label>
                    <textarea
                      className="form-control"
                      name="observations"
                      onChange={handleChange}
                      placeholder="Observations"
                      value={tier.observations}
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <label>Type:</label>
                    <select
                      style={{ color: "black" }}
                      className={`form-control ${errors.type && "is-invalid"}`}
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
                      <div className="invalid-feedback">{errors.type}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>MF/CIN:</label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.MF_CIN && "is-invalid"
                      }`}
                      name="MF_CIN"
                      onChange={handleChange}
                      placeholder="MF / CIN"
                      value={tier.MF_CIN}
                    />
                    {errors.MF_CIN && (
                      <div className="invalid-feedback">{errors.MF_CIN}</div>
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
                      placeholder="Identité"
                      value={tier.identite}
                    />
                    {errors.identite && (
                      <div className="invalid-feedback">{errors.identite}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Ville:</label>
                    <select
                      className="form-control"
                      name="ville"
                      onChange={handleChange}
                      style={{ color: "black" }}
                      value={tier.ville}
                    >
                      <option value="">Sélectionnez une Ville...</option>
                      {villesTunisie.map((ville) => (
                        <option key={ville} value={ville}>
                          {ville}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <label>Autre Type:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="autreType"
                      onChange={handleChange}
                      placeholder="Autre Type"
                      value={tier.autreType}
                      disabled={tier.type !== "autre"}
                    />
                  </div>

                  <div className="form-group">
                    <label>Téléphone:</label>
                    <input
                      type="text"
                      className={`form-control ${errors.tel && "is-invalid"}`}
                      name="tel"
                      onChange={handleChange}
                      placeholder="Téléphone"
                      value={tier.tel}
                    />
                    {errors.tel && (
                      <div className="invalid-feedback">{errors.tel}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Banque:</label>

                    <Select
                      isMulti
                      options={banquesOptions}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      onChange={handleMultiSelectChange}
                      value={tier.banques.map((banque) => ({
                        value: banque.id,
                        label: banque.name,
                      }))} // Example value mapping
                    />
                  </div>

                  <div className="form-group">
                    <label>Pays:</label>
                    <Select
                      options={paysOptions}
                      classNamePrefix="select"
                      name="pays"
                      onChange={handleSelectChange}
                      value={paysOptions.find(
                        (option) => option.value === tier.pays
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-center">
                <button className="btn btn-primary mr-2" type="submit">
                  Modifier
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
