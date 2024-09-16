import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../Connexion/UserProvider";

const DetailsAchat = ({ isSidebarOpen }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [achat, setAchat] = useState(null); // Initialiser avec null pour gérer le chargement

  useEffect(() => {
    const fetchAchatDetails = async (id) => {
      try {
        const response = await axios.get(`http://localhost:5000/achats/${id}`);
        const data = response.data[0];
        setAchat(data);
      } catch (error) {
        console.error("Error fetching Achat details:", error);
      } 
    };

    fetchAchatDetails(id);
  }, [id]);

  const getImageType = (base64String) => {
    if (typeof base64String !== 'string') {
      return 'jpeg'; // Par défaut à JPEG si base64String n'est pas une chaîne
    }
    
    // Vérifier les premiers caractères du fichier base64 pour identifier le type MIME
    if (base64String.startsWith('/9j/')) {
      return 'jpeg'; // Indice pour JPEG
    } else if (base64String.startsWith('iVBORw0KGgo')) {
      return 'png'; // Indice pour PNG
    } else {
      return 'jpeg'; // Par défaut à JPEG si inconnu
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return isNaN(d.getTime()) ? "Date invalide" : d.toLocaleDateString();
  };

  const handleCancel = () => {
    navigate("/achats");
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/achats/${id}`);
      navigate("/achats");
    } catch (err) {
      console.log(err);
    }
  };

  const confirmDelete = (id) => {
    const confirmDelete = window.confirm("Voulez-vous vraiment supprimer cet Achat ?");
    if (confirmDelete) {
      handleDelete(id);
    }
  };



  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? "shifted" : ""}`}>
        <div className="d-flex justify-content-center align-items-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h3 className="d-flex justify-content-center">Détails de l'Achat</h3>
                <ul className="list-ticked" style={{ fontSize: "16px" }}>
  {achat ? (
    <>
      <li>
        <strong style={{ color: "#118ab2", fontWeight: "bold" }}>Date de Saisie :</strong> {formatDate(achat.date_saisie)}
      </li>
      <li>
        <strong style={{ color: "#118ab2", fontWeight: "bold" }}>Code Tiers :</strong> {achat.code_tiers || "Non spécifié"}
      </li>
      <li>
        <strong style={{ color: "#118ab2", fontWeight: "bold" }}>Tiers a Saisir :</strong> {achat.tiers_saisie || "Non spécifié"}
      </li>
      <li>
        <strong style={{ color: "#118ab2", fontWeight: "bold" }}>Type de la Pièce :</strong> {achat.type_piece || "Non spécifié"}
      </li>
      <li>
        <strong style={{ color: "#118ab2", fontWeight: "bold" }}>N° de la Pièce :</strong> {achat.num_piece || "Non spécifié"}
      </li>
      <li>
        <strong style={{ color: "#118ab2", fontWeight: "bold" }}>Date de la Pièce :</strong> {formatDate(achat.date_piece)}
      </li>
      <li>
        <strong style={{ color: "#118ab2", fontWeight: "bold" }}>Statut :</strong> {achat.statut || "Non spécifié"}
      </li>
      <li>
        <strong style={{ color: "#118ab2", fontWeight: "bold" }}>Montant HT de la Pièce :</strong> {achat.montant_HT_piece || "Non spécifié"} DT
      </li>
      <li>
        <strong style={{ color: "#118ab2", fontWeight: "bold" }}>FODEC sur la Pièce :</strong> {achat.FODEC_piece || "Non spécifié"} DT
      </li>
      <li>
        <strong style={{ color: "#118ab2", fontWeight: "bold" }}>TVA de la Pièce :</strong> {achat.TVA_piece || "Non spécifié"} DT
      </li>
      <li>
        <strong style={{ color: "#118ab2", fontWeight: "bold" }}>Timbre sur la Pièce :</strong> {achat.timbre_piece || "Non spécifié"} DT
      </li>
      <li>
        <strong style={{ color: "#118ab2", fontWeight: "bold" }}>Autre Montant sur la Pièce :</strong> {achat.autre_montant_piece} DT
      </li>
      <li>
        <strong style={{ color: "#118ab2", fontWeight: "bold" }}>Montant Total de la Pièce :</strong> {achat.montant_total_piece || "Non spécifié"} DT
      </li>
      <li>
        <strong style={{ color: "#118ab2", fontWeight: "bold" }}>Observations :</strong> {achat.observations || "Non spécifié"}
      </li>
      <li>
        <strong style={{ color: "#118ab2", fontWeight: "bold" }}>Document / Fichier à Insérer :</strong>
        {achat.document_fichier && typeof achat.document_fichier === 'string' && achat.document_fichier.length > 0 ? (
  <img
    src={`data:image/${getImageType(achat.document_fichier)};base64,${achat.document_fichier}`}
    alt="Document"
    style={{ maxWidth: "100%", height: "auto" }}
  />
) : (
  <p>Aucun fichier disponible</p>
)}

      </li>
    </>
  ) : (
    <p>Chargement des détails...</p> // Message de chargement pendant que l'API est en attente
  )}
</ul>

                <div className="d-flex justify-content-center">
                  {user.role !== "comptable" && (
                    <>
                      <Link to={`/updateAchat/${id}`} className="mr-2">
                        <button type="button" className="btn btn-success">Modifier</button>
                      </Link>
                      <button
                        type="button"
                        className="btn btn-danger mr-2"
                        onClick={() => confirmDelete(id)}
                      >
                        Supprimer
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    className="btn btn-warning mr-2"
                    onClick={handleCancel}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsAchat;
