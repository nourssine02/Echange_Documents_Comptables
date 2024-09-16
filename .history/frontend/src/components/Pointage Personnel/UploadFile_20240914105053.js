import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const UploadFile = () => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  // Colonnes attendues dans le fichier CSV
  const expectedColumns = ["CODE TIERS", "IDENTITE DU TIERS", "TYPE DE PAIE",	"NBRES DE JOURS OU D'H TRAVAILLES",	"NBRES DE JOURS OU D'H SUPP.",	"NBRES DE JOURS OU D'H D'ABSENCE",	"NBRES DE JOURS OU D'H DE CONGE ANNUEL","NBRES DE JOURS OU D'H AUTRES CONGES","SUPPLEMENT RECU","AVANCES SUR SALAIRES",	"REMBOURSEMENTS DE PRÊTS"	,"AUTRES DEDUCTIONS"	,"OBSERVATIONS"];

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    console.log("File : ",e.target.files[0]);
  };

  const validateCSV = async (file) => {
    const reader = new FileReader();

    return new Promise((resolve, reject) => {
      reader.onload = (e) => {
        const fileContent = e.target.result;
        const rows = fileContent.split("\n");

        if (rows.length > 0) {
          const fileColumns = rows[0].split(",");

          // Vérifier si les colonnes correspondent aux colonnes attendues
          const isValid = expectedColumns.every((col, index) => col.trim() === fileColumns[index]?.trim());
          console.log(isValid);
          resolve(isValid);
        } else {
          resolve(false);
        }
      };

      reader.onerror = (err) => reject(err);
      reader.readAsText(file);
    });
  };

  const handleUpload = async () => {
    if (!file) {
      Swal.fire("Erreur", "Veuillez sélectionner un fichier", "error");
      return;
    }

    const isValidCSV = await validateCSV(file);

    if (!isValidCSV) {
      Swal.fire({
        icon: 'error',
        title: 'Format de fichier incorrect',
        text: 'Le fichier CSV importé ne correspond pas au format attendu.',
        footer: '<a href="/FICHIER_DE_POINTAGE.xlsx" download>Télécharger un exemple de fichier CSV</a>'
      });
      
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://localhost:5000/pointage", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      Swal.fire("Succès", "Fichier importé avec succès", "success");
      navigate("/fichePaie");
    } catch (error) {
      console.error("Error uploading file:", error);
      Swal.fire("Erreur", "Échec de l'importation du fichier", "error");
    }
  };

  return (
    <div className="mb-5">
      <div className="input-group" style={{ maxWidth: "500px" }}>
        <input
          type="file"
          onChange={handleFileChange}
          className="form-control mr-4"
        />
        <button className="btn btn-dark" onClick={handleUpload}>
          Import Fiche Excel
        </button>
      </div>
    </div>
  );
};

export default UploadFile;
