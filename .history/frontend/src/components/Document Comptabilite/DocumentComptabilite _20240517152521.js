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
    try {
      const res = await axios.get("/documents_comptabilite"); // Updated URL
      setDocuments(res.data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };
  
  const createDocument = async () => {
    try {
      await axios.post("/documents_comptabilite", form); // Updated URL
      fetchDocuments();
    } catch (error) {
      console.error("Error creating document:", error);
    }
  };
  
  const updateDocument = async (id) => {
    try {
      await axios.put(`/documents_comptabilite/${id}`, form); // Updated URL
      fetchDocuments();
    } catch (error) {
      console.error("Error updating document:", error);
    }
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
            <label htmlFor="date">Date de la periode:</label>
<input
  id="date"
  name="date"
  placeholder="Date"
  type="date"
  onChange={handleChange}
  className="form-control"
/>

<label htmlFor="nature">Nature du Document:</label>
<select
  id="nature"
  name="nature"
  className="form-control"
  value={form.nature}
  onChange={handleChange}
>
  <option value="">Sélectionnez la nature</option>
  <option value="Type1">Type 1</option>
  <option value="Type2">Type 2</option>
  <option value="Type3">Type 3</option>
  {/* Add more options as needed */}
</select>

<label htmlFor="designation">Désignation:</label>
<input
  id="designation"
  name="designation"
  type="text"
  placeholder="Désignation"
  onChange={handleChange}
  className="form-control"
/>

<label htmlFor="destinataire">Destinataire:</label>
<input
  id="destinataire"
  name="destinataire"
  type="text"
  placeholder="Destinataire"
  onChange={handleChange}
  className="form-control"
/>

<label htmlFor="document">Document/ Fichier à In:</label>
<input
  id="document"
  name="document"
  type="file"
  placeholder="Document"
  onChange={handleChange}
  className="form-control"
/>

<label htmlFor="priorite">Priorité:</label>
<select
  id="priorite"
  name="priorite"
  className="form-control mr-3"
  onChange={handleChange}
>
  <option value="">Sélectionnez une priorité</option>
  <option value="Normale">Normale</option>
  <option value="Importante">Importante</option>
</select>

<label htmlFor="observations">Observations:</label>
<textarea
  id="observations"
  name="observations"
  placeholder="Observations"
  onChange={handleChange}
  className="form-control"
/>

              <br></br>
             
                <button
                  type="submit"
                  onClick={createDocument}
                  className="btn btn-primary mr-2"
                  style={{ marginBottom: "5px", marginLeft: "400px" }}
                >
                  Ajouter
                </button>

            </form>
            <ul>
              {documents.map((doc) => (
                <li key={doc.id}>
                  {doc.designation} - {doc.date}
                  <button onClick={() => updateDocument(doc.id)} className="btn btn-success">
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
