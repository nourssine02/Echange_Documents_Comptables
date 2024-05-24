// AddDocCompta.js
import React, { useState } from "react";
import axios from "axios";

const AddDocCompta = ({ fetchDocuments }) => {
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

  const createDocument = async () => {
    try {
      await axios.post("http://localhost:5000/documents_comptabilite", form);
      fetchDocuments();
    } catch (error) {
      console.error("Error creating document:", error);
    }
  };

  return (
    <form>
      {/* Vos champs de formulaire et bouton Ajouter */}
    </form>
  );
};

export default AddDocCompta;
