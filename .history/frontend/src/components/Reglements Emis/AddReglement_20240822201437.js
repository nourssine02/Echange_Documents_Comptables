import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Connexion/UserProvider";
import Select from "react-select";
import "./AddReglement.css";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import TiersSaisie from "../TiersSaisie";

const AddReglement = ({ isSidebarOpen }) => {
  const { user } = useContext(UserContext);

  const initialReglementState = {
    date_saisie: new Date().toISOString().split("T")[0],
    tierId: "",
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
  const [errors, setErrors] = useState({});
  const [options, setOptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [banques, setBanques] = useState([]);

  const axiosWithAuth = () => {
    const token = localStorage.getItem("token");
    return axios.create({
      baseURL: "http://localhost:5000",
      headers: { Authorization: `Bearer ${token}` },
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
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [tiersResponse, tauxResponse, piecesResponse] = await Promise.all(
          [
            axios.get("http://localhost:5000/code_tiers", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get("http://localhost:5000/taux_retenue_source/active", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get("http://localhost:5000/pieces", {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]
        );

        setCodeTiers(tiersResponse.data);
        setTaux(tauxResponse.data);
        const piecesOptions = piecesResponse.data.map((piece) => ({
          value: piece.num_piece,
          label: piece.num_piece,
          date_piece: new Date(piece.date_piece).toISOString().split("T")[0],
          montant_total_piece: piece.montant_total_piece,
          document_fichier: piece.document_fichier,
        }));
        setOptions(piecesOptions);
      } catch (err) {
        console.error("Erreur lors de la récupération des données:", err);
      }
    };
    fetchData();
  }, []);

  const fetchBanques = async (tierId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/tiers/${tierId}/banques`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBanques(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des banques:", error);
    }
  };

  const handleSelectChange = (selectedOption, index) => {
    const updatedPieces = [...pieces];
    updatedPieces[index] = {
      ...updatedPieces[index],
      num_piece_a_regler: selectedOption?.value || "",
      date_piece_a_regler: selectedOption?.date_piece || "",
      montant_piece_a_regler: selectedOption?.montant_total_piece || "",
      document_fichier: selectedOption?.document_fichier || "",
    };
    setPieces(updatedPieces);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReglement((prevReglement) => {
      const updatedReglement = { ...prevReglement, [name]: value };

      if (name === "code_tiers") fetchBanques(value);

      if (["base_retenue_source", "taux_retenue_source"].includes(name)) {
        const base = parseFloat(updatedReglement.base_retenue_source) || 0;
        const taux = parseFloat(updatedReglement.taux_retenue_source) || 0;
        updatedReglement.montant_retenue_source = ((base * taux) / 100).toFixed(
          3
        );
      }

      if (["montant_brut", "montant_retenue_source"].includes(name)) {
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

    if (name === "tiers_saisie" && value !== "") setShowModal(true);
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

    // Vérification des champs obligatoires qui doivent être des nombres
    switch (name) {
      case "montant_brut":
        error =
          value && !isNaN(parseFloat(value))
            ? ""
            : "Le montant brut est obligatoire et doit être un nombre valide";
        break;
      case "base_retenue_source":
        error =
          value && !isNaN(parseFloat(value))
            ? ""
            : "La base retenue à la source est obligatoire et doit être un nombre valide";
        break;
      case "taux_retenue_source":
        error =
          value && !isNaN(value)
            ? ""
            : "Le taux retenue à la source est obligatoire";
        break;
      case "montant_retenue_source":
        error =
          value && !isNaN(parseFloat(value))
            ? ""
            : "Le montant retenue à la source est obligatoire et doit être un nombre valide";
        break;
      case "montant_net":
        error =
          value && !isNaN(parseFloat(value))
            ? ""
            : "Le montant net est obligatoire et doit être un nombre valide";
        break;
      default:
        // Les champs optionnels n'ont pas besoin d'être des nombres
        error = value ? "" : "";
        break;
    }

    // Mise à jour des erreurs
    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };
  const validateForm = () => {  
    const newErrors = {};  
    if (!reglement.tierId) newErrors.tierId = "Le champ 'Tier' est requis.";  
    if (!reglement.montant_brut) newErrors.montant_brut = "Le montant brut est requis.";  
    // Ajoutez d'autres validations selon vos besoins  

    setErrors(newErrors);  
    return Object.keys(newErrors).length === 0;  
  };

  const handleSubmit = async (e) => {  
    e.preventDefault();  
    
    if (!validateForm()) {  
      Swal.fire({  
        icon: "error",  
        title: "Erreur",  
        text: "Veuillez corriger les erreurs avant de soumettre.",  
      });  
      return;  
    }  

    try {  
      const formData = new FormData();  
      Object.keys(reglement).forEach((key) => {  
        formData.append(key, reglement[key]);  
      });  
      payements.forEach((payement, index) => {  
        Object.keys(payement).forEach((key) =>  
          formData.append(`payements[${index}][${key}]`, payement[key])  
        );  
      });  
      pieces.forEach((piece, index) => {  
        Object.keys(piece).forEach((key) => {  
          formData.append(`pieces[${index}][${key}]`, piece[key]);  
        });  
      });  

      const response = await axios.post(  
        "/reglements_emis",  
        formData,  
        {  
          headers: { "Content-Type": "multipart/form-data" },  
        }  
      );  
      console.log("Valeurs de reglement :", response.data);  

      if (user.role === "client") {  
        const notificationMessage = `${user.identite} a ajouté un nouveau règlement`;  

        const notificationData = {  
          userId: user.id,  
          message: notificationMessage,  
        };  

        await axios.post(  
          "http://localhost:5000/notifications",  
          notificationData  
        );  
      }  

      Swal.fire({  
        icon: "success",  
        title: "Succès",  
        text: "Règlement ajouté avec succès.",  
      }).then(() => {  
        navigate("/reglements_emis");  
      });  
    } catch (error) {  
      console.error("Erreur lors de l'ajout du règlement:", error);  
      Swal.fire({  
        icon: "error",  
        title: "Erreur",  
        text: "Une erreur est survenue lors de l'ajout du règlement.",  
      });  
    }  
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
                    <Select
                      options={codeTiers.map((tier) => ({
                        value: tier.id,
                        label: `${tier.code_tiers} - ${tier.identite}`,
                      }))}
                      onChange={(option) => {
                        setReglement((prevState) => ({
                          ...prevState,
                          tierId: option?.value || "", // Stocker l'ID du tiers dans tierId
                          code_tiers:
                            codeTiers.find((tier) => tier.id === option?.value)
                              ?.code_tiers || "", // Stocker le code du tiers dans code_tiers
                        }));
                        fetchBanques(option?.value || "");
                      }}
                      value={
                        codeTiers.find((tier) => tier.id === reglement.tierId)
                          ? {
                              value: reglement.tierId,
                              label: `${
                                codeTiers.find(
                                  (tier) => tier.id === reglement.tierId
                                ).code_tiers
                              } - ${
                                codeTiers.find(
                                  (tier) => tier.id === reglement.tierId
                                ).identite
                              }`,
                            }
                          : null
                      }
                    />
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
                        className="form-control"
                        name="montant_brut"
                        value={reglement.montant_brut}
                        onChange={handleChange}
                      />
                      &nbsp;
                      <span>DT</span>
                    </div>
                    {errors.montant_brut && (
                      <small className="text-danger">
                        {errors.montant_brut}
                      </small>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Base retenue source :</label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="text"
                        className="form-control"
                        name="base_retenue_source"
                        value={reglement.base_retenue_source}
                        onChange={handleChange}
                      />
                      &nbsp;
                      <span>DT</span>
                    </div>
                    {errors.base_retenue_source && (
                      <small className="text-danger">
                        {errors.base_retenue_source}
                      </small>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Taux retenue source :</label>
                    <select
                      style={{ color: "black" }}
                      className="form-control"
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
                      <small className="text-danger">
                        {errors.taux_retenue_source}
                      </small>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Montant retenue source :</label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="text"
                        className="form-control"
                        name="montant_retenue_source"
                        value={reglement.montant_retenue_source}
                        onChange={handleChange}
                      />
                      &nbsp;
                      <span>DT</span>
                    </div>
                    {errors.montant_retenue_source && (
                      <small className="text-danger">
                        {errors.montant_retenue_source}
                      </small>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Montant net :</label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <input
                        type="text"
                        className="form-control"
                        name="montant_net"
                        value={reglement.montant_net}
                        onChange={handleChange}
                      />
                      &nbsp;
                      <span>DT</span>
                    </div>
                    {errors.montant_net && (
                      <small className="text-danger">
                        {errors.montant_net}
                      </small>
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
                  Ajouter
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
