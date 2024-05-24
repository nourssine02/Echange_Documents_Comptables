import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Connexion/UserProvider";

const AddAchat = () => {
  const { user } = useContext(UserContext); // Obtenez les informations sur l'utilisateur connecté depuis le contexte utilisateur

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
    clientId: "", // Ajout du champ clientId pour sélectionner le client
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

    if (name === "code_tiers") {
      const selectedCodeTier = codeTiers.find(
        (codeTier) => codeTier.code_tiers === value
      );
      if (selectedCodeTier) {
        setAchat((prev) => ({
          ...prev,
          code_tiers: selectedCodeTier.code_tiers,
          tiers_saisie: selectedCodeTier.identite,
        }));
      } else {
        setAchat((prev) => ({
          ...prev,
          code_tiers: "",
          tiers_saisie: "",
        }));
      }
    } else if (name === "document_fichier" && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result.split(",")[1];
        const url = `data:image/png;base64,${base64Data}`;
        setAchat((prev) => ({ ...prev, document_fichier: url }));
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setAchat((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/achats", achat);
      console.log(achat);

      // Ajouter une notification
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

  return (
    <div className="d-flex justify-content-center align-items-center login-container">
      <form className="login-form text-center">
        <h2 className="mb-5 font-weight-light text-uppercase">Ajouter un Achat</h2>
        {/* Ajoutez le champ de sélection du client */}
        <div className="form-group">
          <select
            className="form-control rounded-pill form-control-lg"
            name="clientId"
            value={achat.clientId}
            onChange={handleChange}
          >
            <option value="">Sélectionner un client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.nom}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <input
            type="date"
            className="form-control rounded-pill form-control-lg"
            placeholder="Date de Saisie"
            name="date_saisie"
            value={achat.date_saisie}
            onChange={handleChange}
          />
        </div>
        {/* Autres champs du formulaire */}
        <div className="form-group">
          <select
            className="form-control rounded-pill form-control-lg"
            name="code_tiers"
            value={achat.code_tiers}
            onChange={handleChange}
          >
            <option value="">Sélectionner un code tiers</option>
            {codeTiers.map((codeTier) => (
              <option key={codeTier.code_tiers} value={codeTier.code_tiers}>
                {codeTier.code_tiers}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <input
            type="text"
            className="form-control rounded-pill form-control-lg"
            placeholder="Tiers Saisie"
            name="tiers_saisie"
            value={achat.tiers_saisie}
            onChange={handleChange}
            readOnly
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            className="form-control rounded-pill form-control-lg"
            placeholder="Type de Pièce"
            name="type_piece"
            value={achat.type_piece}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            className="form-control rounded-pill form-control-lg"
            placeholder="Numéro de Pièce"
            name="num_piece"
            value={achat.num_piece}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="date"
            className="form-control rounded-pill form-control-lg"
            placeholder="Date de Pièce"
            name="date_piece"
            value={achat.date_piece}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            className="form-control rounded-pill form-control-lg"
            placeholder="Statut"
            name="statut"
            value={achat.statut}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            className="form-control rounded-pill form-control-lg"
            placeholder="Montant HT Pièce"
            name="montant_HT_piece"
            value={achat.montant_HT_piece}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            className="form-control rounded-pill form-control-lg"
            placeholder="FODEC Pièce"
            name="FODEC_piece"
            value={achat.FODEC_piece}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            className="form-control rounded-pill form-control-lg"
            placeholder="TVA Pièce"
            name="TVA_piece"
            value={achat.TVA_piece}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            className="form-control rounded-pill form-control-lg"
            placeholder="Timbre Pièce"
            name="timbre_piece"
            value={achat.timbre_piece}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            className="form-control rounded-pill form-control-lg"
            placeholder="Autre Montant Pièce"
            name="autre_montant_piece"
            value={achat.autre_montant_piece}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            className="form-control rounded-pill form-control-lg"
            placeholder="Montant Total Pièce"
            name="montant_total_piece"
            value={achat.montant_total_piece}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <textarea
            className="form-control rounded-pill form-control-lg"
            placeholder="Observations"
            name="observations"
            value={achat.observations}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="form-group">
          <input
            type="file"
            className="form-control rounded-pill form-control-lg"
            placeholder="Document Fichier"
            name="document_fichier"
            onChange={handleChange}
          />
        </div>
        <button
          type="submit"
          className="btn mt-5 rounded-pill btn-lg btn-custom btn-block text-uppercase"
          onClick={handleClick}
        >
          Ajouter
        </button>
      </form>
    </div>
  );
};

export default AddAchat;
