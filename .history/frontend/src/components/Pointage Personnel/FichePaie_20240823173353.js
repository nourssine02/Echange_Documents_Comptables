import React, { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import UploadFile from "./UploadFile";

const FichePaie = ({ isSidebarOpen }) => {
  const [fiches, setFiches] = useState([]);
  const [detailsVisible, setDetailsVisible] = useState({});

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
    doc.text(`Fiche de Paie`, 20, 20);
    doc.text(`Date de Saisie: ${fiche.date_de_saisie}`, 20, 30);
    doc.text(`Code Tiers: ${fiche.code_tiers}`, 20, 40);
    doc.text(`Nbre Jours Travailles1: ${fiche.nbre_jours_travailles1}`, 20, 50);
    doc.text(`Nbre Jours Travailles2: ${fiche.nbre_jours_travailles2}`, 20, 60);
    doc.text(`Nbre Jours Absence1: ${fiche.nbre_jours_absence1}`, 20, 70);
    doc.text(`Nbre Jours Absence2: ${fiche.nbre_jours_absence2}`, 20, 80);
    doc.text(`Nbre Jours Conges1: ${fiche.nbre_jours_conges1}`, 20, 90);
    doc.text(`Nbre Jours Conges2: ${fiche.nbre_jours_conges2}`, 20, 100);
    doc.text(`Supplement Recus: ${fiche.supplement_recus}`, 20, 110);
    doc.text(`Sommes Rejetees: ${fiche.sommes_rejetees}`, 20, 120);
    doc.text(`Remboursement Divers: ${fiche.remboursement_divers}`, 20, 130);
    doc.text(`Autre Deduction: ${fiche.autre_deduction}`, 20, 140);
    doc.text(`Observations: ${fiche.observations}`, 20, 150);

    doc.save("Fiche_de_Paie.pdf");
  };

  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? "shifted" : ""}`}>
        <div className="card">
          <div className="card-body">
            <h1 className="text-center">Table du Pointage Personnel</h1>
            <br></br><br></br>
            <UploadFile />
            <div className="table-responsive table-sm pt-3">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Date de Saisie</th>
                    <th>Code Tiers</th>
                    <th>Jours Travaillés</th>
                    <th>Jours d'Absence</th>
                    <th>Jours de Congés</th>
                    <th>Supplement Reçus</th>
                    <th></th> {/* Colonne pour le bouton */}
                    <th></th> {/* Colonne pour le bouton de téléchargement */}
                  </tr>
                </thead>
                <tbody>
                  {fiches.map((fiche) => (
                    <tr key={fiche.id}>
                      <td>{new Date(fiche.date_de_saisie).toLocaleDateString()}</td>
                      <td>{fiche.code_tiers}</td>
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
                        <button onClick={() => generatePDF(fiche)} className="btn btn-success mr-2">Download</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Affichage des détails supplémentaires */}
              {fiches.map((fiche) => (
                detailsVisible[fiche.id] && (
                  <div key={fiche.id} className="details-section mt-3">
                    <div style={{marginRight : "150px"}}><strong>Sommes Rejetées:</strong> {fiche.sommes_rejetees}
                    <strong>Remboursement Divers:</strong> {fiche.remboursement_divers}</div>
                    <strong>Autre Déduction:</strong> {fiche.autre_deduction}
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FichePaie;
