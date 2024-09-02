import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Connexion/UserProvider";
import Select from "react-select";
import "./AddReglement.css";
import "react-toastify/dist/ReactToastify.css";
import TiersSaisie from "../TiersSaisie";
import Swal from 'sweetalert2';


const AddReglement = ({ isSidebarOpen }) => {
  const { user } = useContext(UserContext);

  const initialReglementState = {
    date_saisie: new Date().toISOString().split("T")[0],
    code_tiers: "",
    tiers_saisie: "",
    montant_brut: "",
    base_retenue_source: "",
    taux_retenue_source: "",
    montant_retenue_source: "",
    montant_net: "",
    observations: "",
  };

  const initialPayementState = {
    modalite: "",
    num: "",
    banque: "",
    date_echeance: "",
    montant: "",
  };

  const initialPieceState = {
    num_piece_a_regler: "",
    date_piece_a_regler: "",
    montant_piece_a_regler: "",
    montant_restant: "",
    document_fichier: "",
  };



  const [reglement, setReglement] = useState(initialReglementState);
  const [payements, setPayements] = useState([initialPayementState]);
  const [pieces, setPieces] = useState([initialPieceState]);
  const [codeTiers, setCodeTiers] = useState([]);
  const [taux, setTaux] = useState([]);
  const [activeTab, setActiveTab] = useState("pieces");
  const [errors, setErrors] = useState({}); // State for form errors
  const [options, setOptions] = useState([]);
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [banques, setBanques] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false); // State for form submission



  const axiosWithAuth = () => {
    const token = localStorage.getItem("token");

    return axios.create({
      baseURL: "http://localhost:5000",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };
  const openImageViewer = (documentUrl) => {
    const imageWindow = window.open("", "_blank");
    const img = document.createElement("img");
    img.src = documentUrl;
    img.style.width = "35%";
    img.style.height = "100%";
    img.style.marginLeft = "400px";
    imageWindow.document.body.appendChild(img);
  };
  const handleModalShow = () => setShowModal(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCodeTiers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/code_tiers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCodeTiers(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCodeTiers();
  }, []);

  useEffect(() => {
    const fetchTaux = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/taux_retenue_source/active", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTaux(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchTaux();
  }, []);

  const fetchBanques = async (tierId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/tiers/${tierId}/banques`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      setBanques(response.data);
    } catch (error) {
      console.error("Error fetching banques:", error);
    }
  };

  useEffect(() => {
    const fetchPieces = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/pieces", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Transform the response data to match the Select component format
        const piecesOptions = response.data.map((piece) => {
          const formattedDate = new Date(piece.date_piece)
            .toISOString()
            .split("T")[0]; // Format date to YYYY-MM-DD
          return {
            value: piece.num_piece,
            label: piece.num_piece,
            date_piece: formattedDate,
            montant_total_piece: piece.montant_total_piece,
            document_fichier: piece.document_fichier,
          };
        });
        setOptions(piecesOptions);
      } catch (error) {
        console.error("Error fetching pieces:", error);
      }
    };

    fetchPieces();
  }, []);

  const handleSelectChange = (selectedOption, index) => {
    const updatedPieces = [...pieces];
    updatedPieces[index] = {
      ...updatedPieces[index],
      num_piece_a_regler: selectedOption ? selectedOption.value : "",
      date_piece_a_regler: selectedOption ? selectedOption.date_piece : "",
      montant_piece_a_regler: selectedOption
        ? selectedOption.montant_total_piece
        : "",
      document_fichier: selectedOption ? selectedOption.document_fichier : "",
    };
    setPieces(updatedPieces);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setReglement((prevReglement) => {
      const updatedReglement = { ...prevReglement, [name]: value };

      // Fetch banks associated with the selected code_tiers
      if (name === "code_tiers") {
        fetchBanques(value);
      }

      // Calcul du montant retenue source si les champs base_retenue_source ou taux_retenue_source changent
      if (name === "base_retenue_source" || name === "taux_retenue_source") {
        const base = parseFloat(updatedReglement.base_retenue_source) || 0;
        const taux = parseFloat(updatedReglement.taux_retenue_source) || 0;
        updatedReglement.montant_retenue_source = ((base * taux) / 100).toFixed(
          3
        );
      }

      // Calcul du montant net si les champs montant_brut ou montant_retenue_source changent
      if (
        name === "montant_brut" ||
        name === "montant_retenue_source" ||
        name === "base_retenue_source" ||
        name === "taux_retenue_source"
      ) {
        const montantBrut = parseFloat(updatedReglement.montant_brut) || 0;
        const montantRetenueSource =
          parseFloat(updatedReglement.montant_retenue_source) || 0;
        updatedReglement.montant_net = (
          montantBrut - montantRetenueSource
        ).toFixed(3);
      }

      return updatedReglement;
    });

    validateField(name, value);

    // Show modal when tiers_saisie is entered
    if (name === "tiers_saisie" && value !== "") {
      setShowModal(true);
    }
  };

  const handleChangePayement = (e, index) => {
    const { name, value } = e.target;
    const updatedPayements = [...payements];
    updatedPayements[index][name] = value;
    setPayements(updatedPayements);
  };

  const handleChangePiece = (e, index) => {
    const { name, value, files } = e.target;
    const updatedPieces = [...pieces];

    if (name === "document_fichier") {
      // Handle file input
      updatedPieces[index][name] = files[0];
    } else {
      updatedPieces[index][name] = value;
    }

    setPieces(updatedPieces);
  };

  const addPayement = () => {
    setPayements([...payements, initialPayementState]);
  };

  const removePayement = (index) => {
    const updatedPayements = [...payements];
    updatedPayements.splice(index, 1);
    setPayements(updatedPayements);
  };

  const addPiece = () => {
    setPieces([...pieces, initialPieceState]);
  };

  const removePiece = (index) => {
    const updatedPieces = [...pieces];
    updatedPieces.splice(index, 1);
    setPieces(updatedPieces);
  };
  const validateField = (name, value) => {
    let error = "";
  
    switch (name) {
      case "montant_brut":
        error = value ? "" : "Le montant brut est obligatoire";
        break;
      case "base_retenue_source":
        error = value ? "" : "La base retenue à la source est obligatoire";
        break;
      case "taux_retenue_source":
        error = value ? "" : "Le taux retenue à la source est obligatoire";
        break;
      case "montant_retenue_source":
        error = value ? "" : "Le montant retenue à la source est obligatoire";
        break;
      case "montant_net":
        error = value ? "" : "Le montant net est obligatoire";
        break;
      default:
        break;
    }
  
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsSubmitting(true); // Indique que le formulaire est en cours de soumission
  
    // Valider tous les champs de `reglement` avant la soumission
    Object.keys(reglement).forEach((key) => validateField(key, reglement[key]));
  
    // Vérifier s'il y a des erreurs de validation
    const hasErrors = Object.values(errors).some((error) => error !== "");
  
    if (!hasErrors) {
      const formData = new FormData();
      
      // Ajouter les détails de l'reglement
      formData.append('reglement', JSON.stringify(reglement));
  
      // Ajouter les détails des payements
      formData.append('payements', JSON.stringify(payements));
  
      // Ajouter les détails des pièces
      pieces.forEach((piece, index) => {
        formData.append(`pieces[${index}][num_piece_a_regler]`, piece.num_piece_a_regler);
        formData.append(`pieces[${index}][date_piece_a_regler]`, piece.date_piece_a_regler);
        formData.append(`pieces[${index}][montant_piece_a_regler]`, piece.montant_piece_a_regler);
        formData.append(`pieces[${index}][montant_restant]`, piece.montant_restant);
  
        // Pour les fichiers uploadés
        if (piece.document_fichier) {
          formData.append(`pieces[${index}][document_fichier]`, piece.document_fichier);
        }
      });
  
      try {
        const token = localStorage.getItem("token");
        const axiosInstance = axiosWithAuth();
        const response = await axiosInstance.post("http://localhost:5000/reglements_emis", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
        });
  
        console.log(response.data.message);
        Swal.fire({
          icon: "success",
          title: "Succès",
          text: "Règlement ajouté avec succès!",
        });
  
        // Ajouter une notification si l'utilisateur est un comptable
        if (user.role === "comptable") {
          const notificationMessage = `${user.identite} a ajouté un Règlement`;
  
          const notificationData = {
            userId: user.id,
            message: notificationMessage,
          };
  
          await axiosInstance.post(
            "http://localhost:5000/notifications",
            notificationData
          );
        }
  
        // Naviguer vers la page des reglements après un délai
        setTimeout(() => {
          navigate("/reglements_emis");
        }, 2000);
      } catch (err) {
        console.error("Erreur lors de l'ajout de l'reglement :", err);
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Erreur lors de l'ajout du règlement!",
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Veuillez vérifier les champs requis!",
      });
    }
    
    setIsSubmitting(false); // Fin de la soumission du formulaire
  };
  

  
  

  const handleCancel = () => {
    navigate("/reglements_emis");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "payements":
        return (
          <div>
            <h3>Paiements</h3>
            {payements.map((payement, index) => (
              <div key={index}>
                <div className="row">
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Modalité :</label>
                      <select
                        style={{ color: "black" }}
                        className="form-control"
                        name="modalite"
                        onChange={(e) => handleChangePayement(e, index)}
                        value={payement.modalite}
                      >
                        <option value="">Sélectionnez...</option>
                        <option value="Chèque">Chèque</option>
                        <option value="Effet">Effet</option>
                        <option value="CB">CB</option>
                        <option value="Virement">Virement</option>
                        <option value="Retrait de fonds">
                          Retrait de fonds
                        </option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Numéro :</label>
                      <input
                        type="text"
                        className="form-control"
                        name="num"
                        onChange={(e) => handleChangePayement(e, index)}
                        value={payement.num}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Banque :</label>
                      <select
                        style={{ color: "black" }}
                        value={payement.banque}
                        name="banque"
                        className="form-control mr-3"
                        onChange={(e) => handleChangePayement(e, index)}
                      >
                        <option value="">Sélectionnez une option</option>
                        {banques.map((banque) => (
                          <option key={banque.id} value={banque.name}>
                            {banque.name}
                          </option>
                        ))}{" "}
                      </select>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Date d'échéance :</label>
                      <input
                        type="date"
                        className="form-control"
                        name="date_echeance"
                        onChange={(e) => handleChangePayement(e, index)}
                        value={payement.date_echeance}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Montant :</label>
                      <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="text"
                        className="form-control"
                        name="montant"
                        onChange={(e) => handleChangePayement(e, index)}
                        value={payement.montant}
                      />
                      &nbsp;
                      <span>DT</span>
                    </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <button
                      type="button"
                      className="btn btn-danger btn-sm mt-5"
                      onClick={() => removePayement(index)}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
                <hr />
              </div>
            ))}

            <button
              type="button"
              className="btn btn-success btn-sm"
              onClick={addPayement}
            >
              Ajouter un paiement
            </button>
          </div>
        );
      case "pieces":
        return (
          <div>
            <h3>Pièces</h3>
            {pieces.map((piece, index) => (
              <div key={index}>
                <div className="row">
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Numéro de pièce à régler :</label>
                      <Select
                        options={options}
                        onChange={(selectedOption) =>
                          handleSelectChange(selectedOption, index)
                        }
                        value={
                          options.find(
                            (option) =>
                              option.value === piece.num_piece_a_regler
                          ) || ""
                        }
                        isClearable
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Date de pièce à régler :</label>
                      <input
                        type="date"
                        className="form-control"
                        name="date_piece_a_regler"
                        onChange={(e) => handleChangePiece(e, index)}
                        value={piece.date_piece_a_regler || ""}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Montant de pièce à régler :</label>
                      <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="text"
                        className="form-control"
                        name="montant_piece_a_regler"
                        onChange={(e) => handleChangePiece(e, index)}
                        value={piece.montant_piece_a_regler || ""}
                      />
                      &nbsp;
                      <span>DT</span>
                    </div>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Montant restant de pièce</label>
                      <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="text"
                        className="form-control"
                        name="montant_restant"
                        onChange={(e) => handleChangePiece(e, index)}
                        value={piece.montant_restant || ""}
                      />
                      &nbsp;
                      <span>DT</span>
                    </div>
                    </div>
                  </div>

                  <div className="col-md-3">
                    <div className="form-group">
                      <label>Document de pièce à régler :</label>
                      
                      {piece.document_fichier && (
                        <img
                          src={piece.document_fichier}
                          alt="Document de pièce à régler"
                          style={{
                            width: "100px",
                            height: "auto",
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            openImageViewer(piece.document_fichier)
                          }
                        />
                      )}
                    </div>
                  </div>

                  <div className="col-md-3">
                    <button
                      type="button"
                      className="btn btn-danger btn-sm mt-5"
                      onClick={() => removePiece(index)}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
                <hr />
              </div>
            ))}

            <button
              type="button"
              className="btn btn-success btn-sm mt-1"
              onClick={addPiece}
            >
              Ajouter une pièce
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? "shifted" : ""}`}>
        <div className="card">
          <div className="card-body">
            <h2 className="text-center">Ajouter un règlement Émis</h2>
            <br />
            <form onSubmit={handleSubmit} className="forms-sample">
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Date de saisie :</label>
                    <input
                      type="date"
                      className="form-control"
                      name="date_saisie"
                      value={reglement.date_saisie}
                      onChange={handleChange}
                    />
                    
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Code tiers :</label>
                    <select
                      style={{ color: "black" }}
                      className="form-control"
                      name="code_tiers"
                      onChange={handleChange}
                      value={reglement.code_tiers}
                    >
                      <option value="">Sélectionner le Code Tiers</option>
                      {codeTiers.map((tier) => (
                        <option key={tier.id} value={tier.id}>
                          {`${tier.code_tiers} - ${tier.identite}`}
                        </option>
                      ))}
                    </select>
                    
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Tiers à Saisir :</label>
                    <input
                      type="text"
                      className="form-control"
                      name="tiers_saisie"
                      value={reglement.tiers_saisie}
                      onChange={handleChange}
                      onClick={handleModalShow}
                      disabled={!!reglement.code_tiers} // Désactiver le champ si un code_tiers est sélectionné
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Montant brut :</label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.montant_brut ? "is-invalid" : ""
                        }`}
                        name="montant_brut"
                        value={reglement.montant_brut}
                        onChange={handleChange}
                      />
                      &nbsp;
                      <span>DT</span>
                    </div>
                    {errors.montant_brut && (
                      <div className="invalid-feedback">
                        {errors.montant_brut}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Base retenue source :</label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.base_retenue_source ? "is-invalid" : ""
                        }`}
                        name="base_retenue_source"
                        value={reglement.base_retenue_source}
                        onChange={handleChange}
                      />
                      &nbsp;
                      <span>DT</span>
                    </div>
                    {errors.base_retenue_source && (
                      <div className="invalid-feedback">
                        {errors.base_retenue_source}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Taux retenue source :</label>
                    <select
                      style={{ color: "black" }}
                      className={`form-control ${
                        errors.taux_retenue_source ? "is-invalid" : ""
                      }`}
                      name="taux_retenue_source"
                      onChange={handleChange}
                      value={reglement.taux_retenue_source}
                    >
                      <option value="" style={{ color: "black" }}>
                        Sélectionnez...
                      </option>
                      {taux.map((taux) => (
                        <option
                          key={taux.taux}
                          value={taux.taux}
                          style={{ color: "black" }}
                        >
                          {taux.taux}%
                        </option>
                      ))}
                    </select>
                    {errors.taux_retenue_source && (
                      <div className="invalid-feedback">
                        {errors.taux_retenue_source}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Montant retenue source :</label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.montant_retenue_source ? "is-invalid" : ""
                        }`}
                        name="montant_retenue_source"
                        value={reglement.montant_retenue_source}
                        onChange={handleChange}
                      />
                      &nbsp;
                      <span>DT</span>
                    </div>
                    {errors.montant_retenue_source && (
                      <div className="invalid-feedback">
                        {errors.montant_retenue_source}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Montant net :</label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.montant_net ? "is-invalid" : ""
                        }`}
                        name="montant_net"
                        value={reglement.montant_net}
                        onChange={handleChange}
                      />
                      &nbsp;
                      <span>DT</span>
                    </div>
                    {errors.montant_net && (
                      <div className="invalid-feedback">
                        {errors.montant_net}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Observations :</label>
                    <textarea
                      className="form-control"
                      name="observations"
                      placeholder="Entrez vos observations ici..."
                      onChange={handleChange}
                      value={reglement.observations}
                    />
                  </div>
                </div>
              </div>
              <div className="tabs">
                <button
                  type="button"
                  className={`btn ${
                    activeTab === "pieces" ? "btn-dark" : "btn-light"
                  }`}
                  onClick={() => setActiveTab("pieces")}
                >
                  Pièces
                </button>
                <button
                  type="button"
                  className={`btn ${
                    activeTab === "payements" ? "btn-dark" : "btn-light"
                  }`}
                  onClick={() => setActiveTab("payements")}
                >
                  Paiements
                </button>
              </div>
              <div className="tab-content">{renderTabContent()}</div>
              <br />
              <div className="d-flex justify-content-center">
                <button type="submit" className="btn btn-primary mr-2">
                {isSubmitting ? "Ajout en cours..." : "Ajouter"}
                </button>
                &nbsp;&nbsp;
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={handleCancel}
                >
                  Annuler
                </button>
              </div>
            </form>
            <TiersSaisie showModal={showModal} setShowModal={setShowModal} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddReglement;
