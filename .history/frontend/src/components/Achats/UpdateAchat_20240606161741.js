import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UpdateAchat = ({isSidebarOpen}) => {
  const { id } = useParams();

  const [achat, setAchat] = useState({
    date_saisie: "",
    code_tiers: "",
    tiers_saisie: "",
    type_piece: "",
    num_piece: "",
    date_piece: "",
    statut: "",
    montant_HT_piece: "",
    FODEC_piece: "",
    TVA_piece: "",
    timbre_piece: "",
    autre_montant_piece: "",
    montant_total_piece: "",
    observations: "",
    document_fichier: "",
  });
  const [codeTiers, setCodeTiers] = useState([]);

  useEffect(() => {
    const fetchCodeTiers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/code_tiers");
        setCodeTiers(res.data);
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCodeTiers();
  }, []);

  const navigate = useNavigate();


  const handleChange = (e) => {
    if (e.target.name === "document_fichier") {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAchat((prev) => ({ ...prev, document_fichier: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      setAchat((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };


  const handleClick = async (e) => {
    e.preventDefault();
    axios
      .put(`http://localhost:5000/achats/${id}`, achat)
      .then((res) => navigate("/achats"))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    axios
      .get(`http://localhost:5000/achats/${id}`)
      .then((res) => {
        const data = res.data[0];
        setAchat({
          date_saisie: data.date_saisie,
          code_tiers: data.code_tiers,
          tiers_saisie: data.tiers_saisie,
          type_piece: data.type_piece,
          num_piece: data.num_piece,
          date_piece: data.date_piece,
          statut: data.statut,
          montant_HT_piece: data.montant_HT_piece,
          FODEC_piece: data.FODEC_piece,
          TVA_piece: data.TVA_piece,
          timbre_piece: data.timbre_piece,
          autre_montant_piece: data.autre_montant_piece,
          montant_total_piece: data.montant_total_piece,
          observations: data.observations,
          document_fichier: data.document_fichier,
        });
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleCancel = () => {
    navigate("/achats");
  };


  const openImageViewer = (documentUrl) => {
    const imageWindow = window.open("", "_blank");
    const img = document.createElement("img");
    img.src = documentUrl;
    img.style.width = "30%";
    img.style.height = "100%";
    img.style.marginLeft = "400px";
    imageWindow.document.body.appendChild(img);
  };

  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? 'shifted' : ''}`}>
      <div className="card">
          <div className="card-body">
            <h1>Modifier un Achat</h1>
            <br />
            <form className="forms-sample">
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Date de Saisie:</label>
                    <input
                      type="date"
                      className="form-control"
                      name="date_saisie"
                      value={achat?.date_saisie ?? ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Code Tiers:</label>

                    <select
                      style={{ color: "black" }}
                      className="form-control form-control-lg"
                      name="code_tiers"
                      value={achat?.code_tiers ?? ""}
                      onChange={handleChange}

                    >
                      <option style={{ color: "black" }}>Code Tiers</option>
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
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Tiers à Saisir:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="tiers_saisie"
                      value={achat?.tiers_saisie ?? ""}
                      onChange={handleChange}

                    />
                  </div>

                  <div className="form-group">
                    <label>Type de la Pièce :</label>
                    <select
                      style={{ color: "black" }}
                      className="form-control"
                      name="type_piece"
                      onChange={handleChange}

                    >
                      <option value={achat?.type_piece ?? ""}>
                        {achat?.type_piece ?? ""}
                      </option>
                      <option value="facture">Facture</option>
                      <option value="note d'honoraire">Note d'honoraire</option>
                      <option value="bon de livraison">Bon de livraison</option>
                      <option value="quittance">Quittance</option>
                      <option value="reçu">Reçu</option>
                      <option value="contrat">Contrat</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>N° de la Pièce :</label>
                    <input
                      type="text"
                      className="form-control"
                      name="num_piece"
                      value={achat?.num_piece ?? ""}
                      onChange={handleChange}

                    />
                  </div>

                  <div className="form-group">
                    <label>Date de la Pièce:</label>
                    <input
                      type="date"
                      className="form-control"
                      name="date_piece"
                      value={achat?.date_piece ?? ""}
                      onChange={handleChange}

                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Statut :</label>
                    <select
                      style={{ color: "black" }}
                      className="form-control"
                      name="statut"
                      onChange={handleChange}

                    >
                      <option value={achat?.statut ?? ""}>
                        {achat?.statut ?? ""}
                      </option>
                      <option value="réglée en espèces">
                        Réglée en espèces
                      </option>
                      <option value="réglée">Réglée</option>
                      <option value="non réglée">Non Réglée</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Montant HT de la Pièce:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="montant_HT_piece"
                      value={achat?.montant_HT_piece ?? ""}
                      onChange={handleChange}

                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>FODEC sur la Pièce:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="FODEC_piece"
                      value={achat?.FODEC_piece ?? ""}
                      onChange={handleChange}

                    />
                  </div>

                  <div className="form-group">
                    <label>TVA de la Pièce:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="TVA_piece"
                      value={achat?.TVA_piece ?? ""}
                      onChange={handleChange}

                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Timbre sur la Pièce:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="timbre_piece"
                      value={achat?.timbre_piece ?? ""}
                      onChange={handleChange}

                    />
                  </div>

                  <div className="form-group">
                    <label>Autre montant sur la Pièce:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="autre_montant_piece"
                      value={achat?.autre_montant_piece ?? ""}
                      onChange={handleChange}

                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Montant Total de la Pièce:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="montant_total_piece"
                      value={achat?.montant_total_piece ?? ""}
                      onChange={handleChange}

                    />
                  </div>

                  <div className="form-group">
                    <label>Observations:</label>
                    <textarea
                      className="form-control"
                      name="observations"
                      value={achat?.observations ?? ""}
                      onChange={handleChange}

                      rows={5}
                      cols={50}
                    />
                  </div>
                </div>
                <div className="col-md-6">
      
                <div className="form-group">
                          <label>Document / Fichier à Insérer :</label>
                          <br />
                          <button
                            type="button"
                            className="btn btn-link"
                            onClick={() =>
                              openImageViewer(achat.document_fichier)
                            }
                          >
                            View Document
                          </button>
                        </div>
                </div>
              </div>
              <div
                className="d-flex justify-content-center"
                >
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
  );
};

export default UpdateAchat;
