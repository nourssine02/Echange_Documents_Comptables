import React, { useState, useEffect } from "react";
import axios from "axios";

const Document_comptabilite = () => {
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

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <div className="card">
          <div className="card-body">
            <h1>Document Comptabilite</h1>
            <br />
            <form className="forms-sample">
              <input name="date" placeholder="Date" onChange={handleChange}  className="form-control"/>
              <input
                name="nature"
                placeholder="Nature"
                onChange={handleChange}
                className="form-control"
              />
              <input
                name="designation"
                placeholder="Désignation"
                onChange={handleChange}
                className="form-control"
              />
              <input
                name="destinataire"
                placeholder="Destinataire"
                onChange={handleChange}
                className="form-control"
              />
              <input
                name="document"
                placeholder="Document"
                onChange={handleChange}
                className="form-control"
              />
              <input
                name="priorite"
                placeholder="Priorité"
                onChange={handleChange}
                className="form-control"
              />
              <textarea
                name="observations"
                placeholder="Observations"
                onChange={handleChange}
                className="form-control"
              />
              <button type="button" onClick={createDocument}>
                Créer
              </button>
              
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

export default Document_comptabilite;
