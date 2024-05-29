import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UpdateVersement = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [versement, setVersement] = useState({
    date_versement: "",
    reference_bordereau_bulletin: "",
    observations: "",
    document_fichier: "",
  });

  const [payements, setPayements] = useState([
    {
      modalite: "",
      num: "",
      banque: "",
      montant: "",
      code_tiers: "",
      tiers_saisie: "",
    },
  ]);

  const [codeTiers, setCodeTiers] = useState([]);

  useEffect(() => {
    const fetchCodeTiers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/code_tiers");
        setCodeTiers(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCodeTiers();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/versement/${id}`
        );
        const { data } = response;
        setVersement(
          data.versement || {
            date_versement: "",
            reference_bordereau_bulletin: "",
            observations: "",
            document_fichier: "",
          }
        );
        setPayements(data.payements || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleCancel = () => {
    navigate("/versements");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      versement,
      payements,
    };

    try {
      const response = await axios.put(
        `http://localhost:5000/versement/${id}`,
        data
      );
      console.log(response.data.message);
      alert("Données mises à jour avec succès.");
      navigate("/versements");
    } catch (error) {
      console.error("Error updating versement:", error);
      alert("Erreur lors de la mise à jour du versement: " + error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "document_fichier" && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result.split(",")[1];
        const url = `data:image/png;base64,${base64Data}`;
        setVersement((prev) => ({ ...prev, document_fichier: url }));
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setVersement((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleChangePayement = (e, index) => {
    const { name, value } = e.target;
    if (name === "code_tiers") {
      const selectedCodeTier = codeTiers.find(
        (codeTier) => codeTier.code_tiers === value
      );
      if (selectedCodeTier) {
        const updatedPayements = [...payements];
        updatedPayements[index]["code_tiers"] = selectedCodeTier.code_tiers;
        updatedPayements[index]["tiers_saisie"] = selectedCodeTier.identite;
        setPayements(updatedPayements);
      } else {
        const updatedPayements = [...payements];
        updatedPayements[index]["code_tiers"] = "";
        updatedPayements[index]["tiers_saisie"] = "";
        setPayements(updatedPayements);
      }
    } else {
      const updatedPayements = [...payements];
      updatedPayements[index][name] = value;
      setPayements(updatedPayements);
    }
  };

  const addPayement = () => {
    setPayements([
      ...payements,
      {
        modalite: "",
        num: "",
        banque: "",
        montant: "",
        code_tiers: "",
        tiers_saisie: "",
      },
    ]);
  };

  const removePayement = (index) => {
    const updatedPayements = [...payements];
    updatedPayements.splice(index, 1);
    setPayements(updatedPayements);
  };

  const openImageViewer = (documentUrl) => {
    const imageWindow = window.open("", "_blank");
    const img = document.createElement("img");
    img.src = documentUrl;
    img.style.width = "40%";
    img.style.height = "100%";
    img.style.marginLeft = "350px";
    imageWindow.document.body.appendChild(img);
  };

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <div className="card">
          <div className="card-body">
            <h1>Modifier un Versement</h1>
            <br />
            <form className="forms-sample" onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Date de versement :</label>
                    <input
                      type="date"
                      className="form-control"
                      name="date_versement"
                      value={versement.date_versement}
                      onChange={handleChange}
                    />
                  </div> 
                  
                  <div className="form-group">
                    <label>Référence du bordereau ou bulletin :</label>
                    <input
                      type="text"
                      name="reference_bordereau_bulletin"
                      className="form-control"
                      value={versement.reference_bordereau_bulletin}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                 

                  <div className="form-group">
                    <label>Observations :</label>
                    <textarea
                      value={versement.observations}
                      className="form-control"
                      name="observations"
                      placeholder="Entrez vos observations ici..."
                      rows={5}
                      cols={50}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label>Document / Fichier à Insérer :</label>
                    <input
                      type="file"
                      className="form-control"
                      name="document_fichier"
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      className="btn btn-link"
                      onClick={() =>
                        openImageViewer(versement.document_fichier)
                      }
                    >
                      View Document
                    </button>
                  </div>
                </div>
              </div>

              <hr />
              <div>
                <h4>Paiements</h4>
                {payements.map((payement, index) => (
                  <div className="row" key={index}>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Nature:</label>
                        <select
                          style={{ color: "black" }}
                          value={payement.modalite}
                          name="modalite"
                          className="form-control"
                          onChange={(e) => handleChangePayement(e, index)}
                        >
                          <option value="">Sélectionnez une option</option>
                          <option value="Espèces">Espèces</option>
                          <option value="Chèque">Chèque</option>
                          <option value="Effet à l'encaissement">
                            Effet à l'encaissement{" "}
                          </option>
                          <option value="Effet à l'escompte">
                            Effet à l'escompte{" "}
                          </option>
                          <option value="CB">CB</option>
                          <option value="Virement">Virement</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>N°:</label>
                        <input
                          type="text"
                          value={payement.num}
                          name="num"
                          className="form-control"
                          onChange={(e) => handleChangePayement(e, index)}
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Banque:</label>
                        <select
                          style={{ color: "black" }}
                          value={payement.banque}
                          name="banque"
                          className="form-control mr-3"
                          onChange={(e) => handleChangePayement(e, index)}
                        >
                          <option value="">Sélectionnez une option</option>
                          <option value="Banques locales">
                            Banques locales
                          </option>
                        </select>
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Code Tiers:</label>

                        <select
                          style={{ color: "black" }}
                          className="form-control mr-3"
                          name="code_tiers"
                          onChange={(e) => handleChangePayement(e, index)}
                          value={payement.code_tiers}
                        >
                          <option value="" style={{ color: "black" }}>
                            Code Tiers
                          </option>
                          {codeTiers.map((codeTier) => (
                            <option
                              key={codeTier.code_tiers}
                              value={codeTier.code_tiers}
                              style={{ color: "black" }}
                            >
                              {codeTier.code_tiers}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Tiers à Saisir:</label>
                        <input
                          type="text"
                          className="form-control mr-3"
                          name="tiers_saisie"
                          onChange={(e) => handleChangePayement(e, index)}
                          value={payement.tiers_saisie}
                        />
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Montant Verse:</label>
                        <input
                          type="number"
                          value={payement.montant}
                          name="montant"
                          className="form-control"
                          onChange={(e) => handleChangePayement(e, index)}
                        />
                      </div>
                    </div>

                    <div className="col-md-3">
                      <br></br>
                      <br></br>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => removePayement(index)}
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-success btn-sm"
                  onClick={addPayement}
                >
                  Ajouter Paiement
                </button>
              </div>
              <hr />
              <br></br>
              <br></br>
              <div
                className="button d-flex align-items-center"
                style={{ gap: "10px", marginLeft: "300px" }}
              >
                <button
                  type="submit"
                  className="btn btn-primary mr-2"
                  style={{ marginBottom: "5px" }}
                >
                  Modifier
                </button>
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={handleCancel}
                >
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

export default UpdateVersement;
