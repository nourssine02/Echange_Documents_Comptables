import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import UploadFile from "./UploadFile";
import { UserContext } from "../Connexion/UserProvider";
import "jspdf-autotable";
import ReactPaginate from 'react-paginate';


const FichePaie = ({ isSidebarOpen }) => {
  const [fiches, setFiches] = useState([]);
  const [detailsVisible, setDetailsVisible] = useState({});
  const { user } = useContext(UserContext);

  const [currentPage, setCurrentPage] = useState(0);
const itemsPerPage = 10;
const offset = currentPage * itemsPerPage;

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
                    <th>
                      Identité <br></br>du Tiers
                    </th>
                    <th>
                      Type <br></br> de Paie
                    </th>
                    <th>
                      Nombres <br></br>Jours/H Travaillés
                    </th>
                    <th>
                      Nombres <br></br>Jours/H Supp
                    </th>
                    <th>
                      Nombres <br></br>Jours/H d'Absence
                    </th>
                    <th>
                      Nombres Jours/H <br></br>de Congé Annuel
                    </th>
                    <th>
                      Nombres Jours/H <br></br>d'Autres Congés
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {fiches.map((fiche) => (
                    <tr key={fiche.id}>
                      <td>{fiche["CODE TIERS"]}</td>
                      <td>{fiche["IDENTITE DU TIERS"]}</td>
                      <td>{fiche["TYPE DE PAIE"]}</td>
                      <td>{fiche["NBRES DE JOURS OU D'H TRAVAILLES"]}</td>
                      <td>{fiche["NBRES DE JOURS OU D'H SUPP."]}</td>
                      <td>{fiche["NBRES DE JOURS OU D'H D'ABSENCE"]}</td>
                      <td>{fiche["NBRES DE JOURS OU D'H DE CONGE ANNUEL"]}</td>
                      <td>{fiche["NBRES DE JOURS OU D'H AUTRES CONGES"]}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-info"
                          onClick={() => toggleDetails(fiche.id)}
                        >
                          {detailsVisible[fiche.id] ? "-" : "+"}
                        </button>
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
                        <strong>Supplement Reçu:</strong>{" "}
                        {fiche["SUPPLEMENT RECU"]}
                      </div>
                      <div style={{ marginRight: "40px" }}>
                        <strong>Avances sur Salaires:</strong>{" "}
                        {fiche["AVANCES SUR SALAIRES"]}
                      </div>
                      <div style={{ marginRight: "40px" }}>
                        <strong>Remboursement de Prets:</strong>{" "}
                        {fiche["REMBOURSEMENTS DE PRÊTS"]}
                      </div>
                      <div style={{ marginRight: "40px" }}>
                        <strong>Autres Déductions:</strong>{" "}
                        {fiche["AUTRES DEDUCTIONS"]}
                      </div>
                      <div style={{ marginRight: "40px" }}>
                        <strong>Observations:</strong> {fiche["OBSERVATIONS"]}
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
