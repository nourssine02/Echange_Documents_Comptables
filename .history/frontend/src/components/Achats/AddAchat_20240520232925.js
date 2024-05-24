import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Connexion/UserProvider";

const AddAchat = () => {
  const { user } = useContext(UserContext);
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
    clientId: "",
  });
  const [codeTiers, setCodeTiers] = useState([]);
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

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
    const fetchClients = async () => {
      try {
        const res = await axios.get("http://localhost:5000/clients");
        setClients(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchClients();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAchat((prev) => ({ ...prev, [name]: value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/achats", achat);
      const notificationMessage = `${user.identite} a ajouté un achat`;
      await axios.post("http://localhost:5000/notifications", {
        userId: user.id,
        message: notificationMessage,
      });
      navigate("/achats");
    } catch (err) {
      console.log(err);
    }
  };

  const handleCancel = () => {
    navigate("/achats");
  };

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <div className="card">
          <div className="card-body">
            <h1>Ajouter un Achat</h1>
            <br />
            <form className="forms-sample">
              <div className="row">
                <div className="col-md-12">
                  {user.role === "comptable" && ( // Condition pour afficher le select uniquement si le rôle de l'utilisateur est "comptable"
                    <div className="form-group">
                      <label>Client :</label>
                      <select
                        className="form-control"
                        style={{ color: "black" }}
                        name="clientId"
                        onChange={handleChange}
                        value={achat.clientId}
                      >
                        <option value="">Sélectionnez un client</option>
                        {clients.map((client) => (
                          <option key={client.id} value={client.id}>
                            {client.identite}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                <div className="col-md-12">
                  <div className="form-group">
                    <label>Date de Saisie:</label>
                    <input
                      type="date"
                      className="form-control"
                      name="date_saisie"
                      onChange={handleChange}
                      placeholder="Date de Saisie"
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label>Code Tiers:</label>

                    <select
                      style={{ color: "black" }}
                      className="form-control"
                      name="code_tiers"
                      onChange={handleChange}
                      value={achat.code_tiers}
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
                  <div className="form-group">
                    <label>Type de la Pièce :</label>
                    <select
                      style={{ color: "black" }}
                      className="form-control"
                      name="type_piece"
                      onChange={handleChange}
                    >
                      <option value="">Sélectionnez...</option>
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
                    <label>Tiers à Saisir:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="tiers_saisie"
                      onChange={handleChange}
                      value={achat.tiers_saisie}
                    />
                  </div>

                  <div className="form-group">
                    <label>Statut :</label>
                    <select
                      style={{ color: "black" }}
                      className="form-control"
                      name="statut"
                      onChange={handleChange}
                    >
                      <option value="">Sélectionnez...</option>
                      <option value="réglée en espèces">
                        Réglée en espèces
                      </option>
                      <option value="réglée">Réglée</option>
                      <option value="non réglée">Non Réglée</option>
                    </select>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label>Date de la Pièce:</label>
                    <input
                      type="date"
                      className="form-control"
                      name="date_piece"
                      onChange={handleChange}
                      placeholder="Date de la Pièce"
                    />
                  </div>

                  <div className="form-group">
                    <label>N° de la Pièce :</label>
                    <input
                      type="text"
                      className="form-control"
                      name="num_piece"
                      onChange={handleChange}
                      placeholder="N° de la Pièce"
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label>Montant HT de la Pièce:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="montant_HT_piece"
                      onChange={handleChange}
                      placeholder="Montant HT de la Pièce"
                    />
                  </div>

                  <div className="form-group">
                    <label>FODEC sur la Pièce:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="FODEC_piece"
                      onChange={handleChange}
                      placeholder="FODEC sur la Pièce"
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label>TVA de la Pièce:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="TVA_piece"
                      onChange={handleChange}
                      placeholder="TVA de la Pièce"
                    />
                  </div>

                  <div className="form-group">
                    <label>Timbre sur la Pièce:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="timbre_piece"
                      onChange={handleChange}
                      placeholder="Timbre sur la Pièce"
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <label>Autre montant sur la Pièce:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="autre_montant_piece"
                      onChange={handleChange}
                      placeholder="Autre montant sur la Pièce"
                    />
                  </div>

                  <div className="form-group">
                    <label>Montant Total de la Pièce:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="montant_total_piece"
                      onChange={handleChange}
                      placeholder="Montant Total de la Pièce"
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
                  </div>

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
                style={{ gap: "10px" }}
              >
                <button
                  type="submit"
                  onClick={handleClick}
                  className="btn btn-primary mr-2"
                  style={{ marginBottom: "5px", marginLeft: "300px" }}
                >
                  Ajouter
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

export default AddAchat;
