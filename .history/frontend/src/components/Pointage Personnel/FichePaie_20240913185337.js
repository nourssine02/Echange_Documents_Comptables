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
    doc.text("Fiche de Paie", 20, 20);
    doc.text(`Date de Saisie: ${new Date(fiche.date_de_saisie).toLocaleDateString()}`, 20, 30);
    doc.text(`Code Tiers: ${fiche.code_tiers}`, 20, 40);
    doc.text(`Identite du Tiers: ${fiche.identite_tiers}`, 20, 50);
    doc.text(`Type de Paie: ${fiche.type_paie}`, 20, 60);
    doc.text(`Nbres Jours/H Travaillés: ${fiche["nbre_jours/H_travailles"]}`, 20, 70);
    doc.text(`Nbres Jours/H Supp: ${fiche["nbre_jours/H_supp"]}`, 20, 80);
    doc.text(`Nbres Jours/H d'Absence: ${fiche["nbre_jours/H_absence"]}`, 20, 90);
    doc.text(`Nbres Jours/H de Congé Annuel: ${fiche["nbre_jours/H_conges_annuel"]}`, 20, 100);
    doc.text(`Nbres Jours/H d' Autres Congés: ${fiche["nbre_jours/H_autres_conges"]}`, 20, 110);
    doc.text(`Supplement Reçu: ${fiche.supplement_recu}`, 20, 120);
    doc.text(`Avances sur Salaires: ${fiche.avance_salaire}`, 20, 130);
    doc.text(`Remboursement de Prets: ${fiche.remboursement_prets}`, 20, 140);
    doc.text(`Autres Déductions: ${fiche.autres_deductions}`, 20, 150);
    doc.text(`Observations: ${fiche.observations}`, 20, 160);
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
            <br />
            <br />
            <br />
            {user.role === "utilisateur" && <UploadFile />}
            <div className="table-responsive table-sm pt-3">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Code Tiers</th>
                    <th>Identite du Tiers</th>
                    <th>Type de Paie</th>
                    <th>Nombres Jours/H <br></br> Travaillés</th>
                    <th>Nombres Jours/H <br></br>Supp</th>
                    <th>Nombres Jours/H <br></br>d'Absence</th>
                    <th>Nombres Jours/H <br></br>de Congé Annuel</th>
                    <th>Nombres Jours/H <br></br>d'Autres Congés</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {fiches.map((fiche) => (
                    <tr key={fiche.id}>
                      <td>{fiche.code_tiers}</td>
                      <td>{fiche.identite_tiers}</td>
                      <td>{fiche.type_paie}</td>
                      <td>{fiche["nbre_jours/H_travailles"]}</td>
                      <td>{fiche["nbre_jours/H_supp"]}</td>
                      <td>{fiche["nbre_jours/H_absence"]}</td>
                      <td>{fiche["nbre_jours/H_conges_annuel"]}</td>
                      <td>{fiche["nbre_jours/H_autres_conges"]}</td>
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
                        <select
                          onChange={(event) => handleDownload(event, fiche)}
                          className="form-control"
                          style={{ color: "black" }}
                        >
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
                        <strong>Supplement Reçu:</strong> {fiche.supplement_recu}
                      </div>
                      <div style={{ marginRight: "40px" }}>
                        <strong>Avances sur Salaires:</strong> {fiche.avance_salaire}
                      </div>
                      <div style={{ marginRight: "40px" }}>
                        <strong>Remboursement de Prets:</strong> {fiche.remboursement_prets}
                      </div>
                      <div style={{ marginRight: "40px" }}>
                        <strong>Autres Déductions:</strong> {fiche.autres_deductions}
                      </div>
                      <div style={{ marginRight: "40px" }}>
                        <strong>Observations:</strong> {fiche.observations}
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
