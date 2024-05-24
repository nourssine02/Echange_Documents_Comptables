// UpdateDocCompta.js
import React, { useState } from "react";
import axios from "axios";

const UpdateDocCompta = ({ id, fetchDocuments }) => {
  const [form, setForm] = useState({
    date: "",
    nature: "",
    designation: "",
    destinataire: "",
    document: "",
    priorite: "",
    observations: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const updateDocument = async () => {
    try {
      await axios.put(`http://localhost:5000/documents_comptabilite/${id}`, form);
      fetchDocuments();
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  return (
    <form>
      {/* Vos champs de formulaire et bouton Modifier */}
    </form>
  );
};

export default UpdateDocCompta;
