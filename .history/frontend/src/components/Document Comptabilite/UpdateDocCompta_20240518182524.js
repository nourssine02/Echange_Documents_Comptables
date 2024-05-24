// UpdateDocCompta.js
import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const UpdateDocCompta = () => {

  const {id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    date: "",
    nature: "",
    designation: "",
    destinataire: "",
    document_fichier: "",
    priorite: "",
    observations: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const updateDocument = async () => {
    try {
      await axios.put(
        `http://localhost:5000/documents_comptabilite/${id}`,
        form
      );
      alert("Données modifiées avec succès.");
      navigate("/documents_comptabilite");
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const handleCancel = () => {
    navigate("/documents_comptabilite");
  };

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <div className="card">
          <div className="card-body">
            <h1>Modifier Document Comptabilite</h1>
            <br />
            <form className="forms-sample">
              <div className="form-group">
                <label htmlFor="date">Date de la periode:</label>
                <input
                  id="date"
                  name="date"
                  placeholder="Date"
                  type="date"
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="nature">Nature du Document:</label>
                <select
                  id="nature"
                  name="nature"
                  style={{ color: "black" }}
                  className="form-control"
                  value={form.nature}
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

              <div className="form-group">
                <label htmlFor="designation">Désignation:</label>
                <input
                  id="designation"
                  name="designation"
                  type="text"
                  placeholder="Désignation"
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="destinataire">Destinataire:</label>
                <input
                  id="destinataire"
                  name="destinataire"
                  type="text"
                  placeholder="Destinataire"
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="document_fichier">
                  Document/ Fichier à Insérer:
                </label>
                <input
                  id="document_fichier"
                  name="document_fichier"
                  type="file"
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="priorite">Priorité:</label>
                <select
                  id="priorite"
                  style={{ color: "black" }}
                  name="priorite"
                  className="form-control mr-3"
                  onChange={handleChange}
                >
                  <option value="">Sélectionnez une priorité</option>
                  <option value="Normale">Normale</option>
                  <option value="Importante">Importante</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="observations">Observations:</label>
                <textarea
                  id="observations"
                  name="observations"
                  placeholder="Observations"
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <br></br>

              <div
                className="button d-flex align-items-center"
                style={{ gap: "10px" }}
              >
              <button
                type="submit"
                onClick={updateDocument}
                className="btn btn-primary mr-2"
                style={{ marginBottom: "5px", marginLeft: "400px" }}
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

export default UpdateDocCompta;
