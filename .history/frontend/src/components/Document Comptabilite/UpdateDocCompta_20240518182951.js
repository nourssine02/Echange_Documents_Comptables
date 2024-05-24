import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const UpdateDocCompta = () => {
  const { id } = useParams();
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

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/documents_comptabilite/${id}`);
        const doc = res.data;
        setForm({
          date: doc.date,
          nature: doc.nature,
          designation: doc.designation,
          destinataire: doc.destinataire,
          document_fichier: "", // The file input will be handled separately
          priorite: doc.priorite,
          observations: doc.observations,
        });
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };
    fetchDocument();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const updateDocument = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      await axios.put(`http://localhost:5000/documents_comptabilite/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Données modifiées avec succès.");
      navigate("/documents_comptabilite");
    } catch (error) {
      console.error("Error updating document:", error);
      alert("Erreur lors de la mise à jour du document: " + error.message);
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
            <form className="forms-sample" onSubmit={updateDocument}>
              <div className="form-group">
                <label htmlFor="date">Date de la periode:</label>
                <input
                  id="date"
                  name="date"
                  placeholder="Date"
                  type="date"
                  value={form.date}
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
                  value={form.designation}
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
                  value={form.destinataire}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label htmlFor="document_fichier">Document/ Fichier à Insérer:</label>
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
                  value={form.priorite}
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
                  value={form.observations}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <br />

              <div className="button d-flex align-items-center" style={{ gap: "10px" }}>
                <button
                  type="submit"
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
