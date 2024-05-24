import React, { useState, useEffect } from "react";
import axios from "axios";

const DocumentComptabilite = () => {
  const [documents, setDocuments] = useState([]);
  const [form, setForm] = useState({
    date: "",
    nature: "",
    designation: "",
    destinataire: "",
    document_fichier: "", // Updated field name
    priorite: "",
    observations: ""
  });

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await axios.get("http://localhost:3000/documents_comptabilite");
      setDocuments(res.data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const createDocument = async () => {
    try {
      await axios.post("http://localhost:3000/documents_comptabilite", form);
      fetchDocuments();
    } catch (error) {
      console.error("Error creating document:", error);
    }
  };

  const updateDocument = async (id) => {
    try {
      await axios.put(`http://localhost:3000/documents_comptabilite/${id}`, form);
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
      {/* Your form and document list rendering */}
    </div>
  );
};

export default DocumentComptabilite;
