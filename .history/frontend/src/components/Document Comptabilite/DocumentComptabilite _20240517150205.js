import React, { useState, useEffect } from "react";
import axios from "axios";

const DocumentComptabilite  = () => {
  const [documents, setDocuments] = useState([]);
  const [form, setForm] = useState({
    date: "",
    nature: "",
    designation: "",
    destinataire: "",
    document: "",
    priorite: "",
    observations: "",
  });

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    const res = await axios.get("http://localhost:3000/documents_comptabilite");
    setDocuments(res.data);
  };

  const createDocument = async () => {
    await axios.post("http://localhost:3000/documents_comptabilite", form);
    fetchDocuments();
  };

  const updateDocument = async (id) => {
    await axios.put(`http://localhost:3000/documents_comptabilite/${id}`, form);
    fetchDocuments();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCancel = () => {
    navigate("/documents_comptabilite");
  };

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <div className="card">
          <div className="card-body">
            <h1>Document Comptabilite</h1>
            <br />
            <form className="forms-sample">
              <input name="date" placeholder="Date" type="date" onChange={handleChange}  className="form-control"/>
              <input
                name="nature"
                type="text"
                placeholder="Nature"
                onChange={handleChange}
                className="form-control"
              />
              <input
                name="designation"
                type="text"
                placeholder="Désignation"
                onChange={handleChange}
                className="form-control"
              />
              <input
                name="destinataire"
                type="text"
                placeholder="Destinataire"
                onChange={handleChange}
                className="form-control"
              />
              <input
                name="document"
                type="file"
                placeholder="Document"
                onChange={handleChange}
                className="form-control"
              />
              <select
                          style={{ color: "black" }}
                          name="priorite"
                          className="form-control mr-3"
                          onChange={handleChange}
                        >
                          <option value="">Sélectionnez une option</option>
                          <option value="Normale">Normale</option>
                          <option value="Importante">Importante</option>
                          
                        </select>
              <textarea
                name="observations"
                placeholder="Observations"
                onChange={handleChange}
                className="form-control"
              />
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
            <ul>
              {documents.map((doc) => (
                <li key={doc.id}>
                  {doc.designation} - {doc.date}
                  <button onClick={() => updateDocument(doc.id)}>
                    Modifier
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentComptabilite ;
