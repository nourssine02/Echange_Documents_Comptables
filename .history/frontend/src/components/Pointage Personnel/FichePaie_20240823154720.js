import React, { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import UploadFile from "./UploadFile";

const FichePaie = ({ isSidebarOpen }) => {
  const [fiches, setSlips] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/pointage");
        setSlips(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

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
                    <th>Sommes Rejetées</th>
                    <th>Remboursement Divers</th>
                    <th>Autre Déduction</th>
                    <th></th>

                  </tr>
                </thead>
                <tbody>
                  {slips.map((slip) => (
                    <tr key={slip.id}>
                      <td>
                      {new Date(slip.date_de_saisie).toLocaleDateString()}
                      </td>
                      <td>{slip.code_tiers}</td>
                      <td>{slip.nbre_jours_travailles1}</td>
                      <td>{slip.nbre_jours_absence1}</td>
                      <td>{slip.nbre_jours_conges1}</td>
                      <td>{slip.supplement_recus}</td>
                      <td>{slip.sommes_rejetees}</td>
                      <td>{slip.remboursement_divers}</td>
                      <td>{slip.autre_deduction}</td>
                      <td>
                        <button onClick={() => generatePDF(slip)} className="btn btn-success mr-2">Download</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FichePaie;
