import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import UploadFile from "./UploadFile";
import { UserContext } from "../Connexion/UserProvider";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const FichePaie = ({ isSidebarOpen }) => {
  const [fiches, setFiches] = useState([]);
  const [detailsVisible, setDetailsVisible] = useState({});
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/pointage");
        setFiches(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const toggleDetails = (ficheId) => {
    setDetailsVisible((prevDetailsVisible) => ({
      ...prevDetailsVisible,
      [ficheId]: !prevDetailsVisible[ficheId],
    }));
  };

  const generatePDF = (fiche) => {
    const doc = new jsPDF();
  
    // Titre principal
    doc.text("Fiche de Paie", 20, 20);
  
    // Ajout des informations avec interpolation des variables
    doc.text(`Date de Saisie: ${new Date(fiche.date_de_saisie).toLocaleDateString()}`, 20, 30);
    doc.text(`Code Tiers: ${fiche.code_tiers}`, 20, 40);
    doc.text(`Nbre Jours Travaillés1: ${fiche.nbre_jours_travailles1}`, 20, 50);
    doc.text(`Nbre Jours Travaillés2: ${fiche.nbre_jours_travailles2}`, 20, 60);
    doc.text(`Nbre Jours Absence1: ${fiche.nbre_jours_absence1}`, 20, 70);
    doc.text(`Nbre Jours Absence2: ${fiche.nbre_jours_absence2}`, 20, 80);
    doc.text(`Nbre Jours Congés1: ${fiche.nbre_jours_conges1}`, 20, 90);
    doc.text(`Nbre Jours Congés2: ${fiche.nbre_jours_conges2}`, 20, 100);
    doc.text(`Supplement Reçus: ${fiche.supplement_recus}`, 20, 110);
    doc.text(`Sommes Rejetées: ${fiche.sommes_rejetees}`, 20, 120);
    doc.text(`Remboursement Divers: ${fiche.remboursement_divers}`, 20, 130);
    doc.text(`Autre Déduction: ${fiche.autre_deduction}`, 20, 140);
    doc.text(`Observations: ${fiche.observations}`, 20, 150);
  
    // Enregistrement du fichier PDF
    doc.save("Fiche_de_Paie.pdf");
  };
  

  const downloadExcel = (fiche) => {
    const worksheet = XLSX.utils.json_to_sheet([fiche]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Fiche");
    XLSX.writeFile(workbook, "Fiche_de_Paie.xlsx");
  };

  const downloadCSV = (fiche) => {
    const worksheet = XLSX.utils.json_to_sheet([fiche]);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "Fiche_de_Paie.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownload = (event, fiche) => {
    const selectedOption = event.target.value;
    switch (selectedOption) {
      case "pdf":
        generatePDF(fiche);
        break;
      case "excel":
        downloadExcel(fiche);
        break;
      case "csv":
        downloadCSV(fiche);
        break;
      default:
        break;
    }
  };

  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? "shifted" : ""}`}>
        <div className="card">
          <div className="card-body">
            <h1 className="text-center">Table du Pointage Personnel</h1>
            <br /><br /><br />
            {user.role === "utilisateur" && <UploadFile />}
            <div className="table-responsive table-sm pt-3">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Code Tiers</th>
                    <th>Identite du Tiers</th>
                    <th>Type de Paie</th>
                    <th>Nbres Jours/H Travaillés</th>
                    <th>Nbres Jours/H Supp</th>
                    <th>Nbres Jours/H d'Absence</th>
                    <th>Nbres Jours/H de Congé Annuel</th>
                    <th>Nbres Jours/H de Autres Congés</th>
                    <th>Supplement Reçu</th>
                    <th></th> {/* Colonne pour le bouton de détails */}
                    <th></th> {/* Colonne pour le bouton de téléchargement */}
                  </tr>
                </thead>
                <tbody>
                  {fiches.map((fiche) => (
                    <tr key={fiche.id}>
                      <td>{fiche.code_tiers}</td>
                      <td>{fiche.identite_tiers}</td>
                      <td>{fiche.nbre_jours_travailles1}</td>
                      <td>{fiche.nbre_jours_absence1}</td>
                      <td>{fiche.nbre_jours_conges1}</td>
                      <td>{fiche.supplement_recus}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-info"
                          onClick={() => toggleDetails(fiche.id)}
                        >
                          {detailsVisible[fiche.id] ? "-" : "+"}
                        </button>
                      </td>
                      <td>
                        <select onChange={(event) => handleDownload(event, fiche)} 
                          className="form-control" style={{color: "black"}}>
                          <option value="">Télécharger</option>
                          <option value="pdf">Télécharger en PDF</option>
                          <option value="excel">Télécharger en Excel</option>
                          <option value="csv">Télécharger en CSV</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Affichage des détails supplémentaires */}
              {fiches.map(
                (fiche) =>
                  detailsVisible[fiche.id] && (
                    <div
                      key={fiche.id}
                      className="details-section mt-3"
                      style={{ display: "flex" }}
                    >
                      <div style={{ marginRight: "40px" }}>
                        <strong>Avances sur Sa:</strong> {fiche.sommes_rejetees}
                      </div>
                      <div style={{ marginRight: "40px" }}>
                        <strong>Sommes Rejetées:</strong> {fiche.sommes_rejetees}
                      </div>
                      <div style={{ marginRight: "40px" }}>
                        <strong>Remboursement Divers:</strong> {fiche.remboursement_divers}
                      </div>
                      <div style={{ marginRight: "40px" }}>
                        <strong>Autre Déduction:</strong> {fiche.autre_deduction}
                      </div>
                    </div>
                  )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FichePaie;
