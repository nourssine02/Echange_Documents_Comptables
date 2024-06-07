import React, { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";

const FichePaie = ({ isSidebarOpen }) => {
  const [slips, setSlips] = useState([]);

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

  const generatePDF = (slip) => {
    const doc = new jsPDF();
    doc.text(`Fiche de Paie`, 20, 20);
    doc.text(`Date de Saisie: ${slip.date_de_saisie}`, 20, 30);
    doc.text(`Code Tiers: ${slip.code_tiers}`, 20, 40);
    doc.text(`Nbre Jours Travailles1: ${slip.nbre_jours_travailles1}`, 20, 50);
    doc.text(`Nbre Jours Travailles2: ${slip.nbre_jours_travailles2}`, 20, 60);
    doc.text(`Nbre Jours Absence1: ${slip.nbre_jours_absence1}`, 20, 70);
    doc.text(`Nbre Jours Absence2: ${slip.nbre_jours_absence2}`, 20, 80);
    doc.text(`Nbre Jours Conges1: ${slip.nbre_jours_conges1}`, 20, 90);
    doc.text(`Nbre Jours Conges2: ${slip.nbre_jours_conges2}`, 20, 100);
    doc.text(`Supplement Recus: ${slip.supplement_recus}`, 20, 110);
    doc.text(`Sommes Rejetees: ${slip.sommes_rejetees}`, 20, 120);
    doc.text(`Remboursement Divers: ${slip.remboursement_divers}`, 20, 130);
    doc.text(`Autre Deduction: ${slip.autre_deduction}`, 20, 140);
    doc.text(`Observations: ${slip.observations}`, 20, 150);

    doc.save("Fiche_de_Paie.pdf");
  };

  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? "shifted" : ""}`}>
        <div className="card">
          <div className="card-body">
            <h1 className="text-center">Pointage Personnel</h1>
            <br></br>
            <div className="table-responsive pt-3">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Date de Saisie</th>
                    <th>Code Tiers</th>
                    <th>Jours Travaillés 1</th>
                    <th>Jours Travaillés 2</th>
                    <th>Jours d'Absence 1</th>
                    <th>Jours d'Absence 2</th>
                    <th>Jours de Congés 1</th>
                    <th>Jours de Congés 2</th>
                    <th>Supplement Reçus</th>
                    <th>Sommes Rejetées</th>
                    <th>Remboursement Divers</th>
                    <th>Autre Déduction</th>
                    <th>Observations</th>
                    <th>Actions</th>

                  </tr>
                </thead>
                <tbody>
                  {slips.map((slip) => (
                    <tr key={slip.id}>
                      <td>{slip.date_de_saisie}</td>
                      <td>{slip.code_tiers}</td>
                      <td>{slip.nbre_jours_travailles1}</td>
                      <td>{slip.nbre_jours_travailles2}</td>
                      <td>{slip.nbre_jours_absence1}</td>
                      <td>{slip.nbre_jours_absence2}</td>
                      <td>{slip.nbre_jours_conges1}</td>
                      <td>{slip.nbre_jours_conges2}</td>
                      <td>{slip.supplement_recus}</td>
                      <td>{slip.sommes_rejetees}</td>
                      <td>{slip.remboursement_divers}</td>
                      <td>{slip.autre_deduction}</td>
                      <td>{slip.observations}</td>
                      <td>
                                <button onClick={() => generatePDF(slip)} className="">Download</button>
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
