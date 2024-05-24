// DocumentComptabilite.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import AddDocCompta from "./AddDocCompta";
import UpdateDocCompta from "./UpdateDocCompta";

const DocumentComptabilite = () => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/documents_comptabilite");
      setDocuments(res.data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  return (
    <div>
      <h1>Liste des Documents Comptables</h1>
      {/* Afficher la liste des documents */}
      <ul>
        {documents.map((doc) => (
          <li key={doc.id}>
            {doc.designation} - {doc.date}
            <UpdateDocCompta id={doc.id} fetchDocuments={fetchDocuments} />
          </li>
        ))}
      </ul>
      <AddDocCompta fetchDocuments={fetchDocuments} />
    </div>
  );
};

export default DocumentComptabilite;
