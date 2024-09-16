import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../Connexion/UserProvider";

const DetailsAchat = ({ isSidebarOpen }) => {
  const { id } = useParams();
  const navigate = useNavigate();
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
    document_fichier: "", // Assuming Base64 blob string from backend (if applicable)
    mime_type: "", // Optionally store the MIME type if available
  });

  const fetchAchatDetails = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/achats/${id}`);
      const data = response.data[0];
      setAchat(data);
    } catch (error) {
      console.error("Error fetching Achat details:", error);
    }
  };

  useEffect(() => {
    fetchAchatDetails(id);
  }, [id]);

  const handleImageDisplay = async () => {
    if (!achat.document_fichier) {
      console.error("Le document n'est pas disponible.");
      return;
    }

    try {
      // Assuming the backend returns the BLOB data as a Base64 string
      const base64Data = achat.document_fichier;
      const mimeType = achat.mime_type || 'image/jpeg'; // Default MIME type

      // Create a data URL from the Base64 data and MIME type
      const dataUrl = `data:<span class="math-inline">\{mimeType\};base64,</span>{base64Data}`;

      // Update the state with the data URL for display
      setAchat({ ...achat, dataUrl });
    } catch (err) {
      console.error("Error creating data URL:", err);
    }
  };

  useEffect(() => {
    handleImageDisplay(); // Call on component mount to display the image
  }, [achat]); // Re-run if `achat` changes (e.g., when the image is fetched)

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
    const confirmDelete = window.confirm(
      "Voulez-vous vraiment supprimer cette Achat ?"
    );
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
              <h3 className="d-flex justify-content-center">
                Détails de l'Achat
              </h3>
              <ul className="list-ticked" style={{ fontSize: "16px" }}>
                {/* ... other list items ... */}
                <li>
                  <strong style={{ color: "#118ab2", fontWeight: "bold" }}>
                    Document / Fichier à Insérer:
                  </strong>
                  {achat.dataUrl && (
                    <img src={achat.dataUrl} alt="Document" />
                  )}
                  {!achat.dataUrl && (
                    <button onClick={handleImageDisplay}>
                      Afficher l'image
                    </button>
                  )}
                </li>
              </ul>
              {/* ... (le reste de votre code) */}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default DetailsAchat;
