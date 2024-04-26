import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";


const ReglementsRecus = () => {
  
  const [reglements, setReglements] = useState([]);


  useEffect(() => {
    const fetchReglements = async () => {
      try {
        const res = await axios.get("http://localhost:5000/reglements_recus");
        console.log(res.data);
        setReglements(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchReglements();
  }, []);

  return (
      <div className="main-panel">
      <div className="content-wrapper">
        <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h2 className="titre">Liste des Règlements Recus</h2>
                <br></br>
                <p className="card-description">
                  <Link to="/addReglementRecu">
                    <button type="button" className="btn btn-info">
                      Ajouter un Règlement Reçus
                    </button>
                  </Link>
                </p>
                <div className="table-responsive pt-3">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Code Tiers</th>
                        <th>Tiers Saisie</th>
                        <th>Montant Total à Régler</th>
                        <th>
                          N° de la <br></br> Facture à Régler
                        </th>
                        <th>
                          Date de la <br></br> Facture à Régler
                        </th>
                        <th>
                          Montant de la <br></br> Facture à Régler
                        </th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {reglements.map((reglement, index) => (
                        <tr key={index}>
                        
                          <td>{reglement.code_tiers}</td>
                          <td>{reglement.tiers_saisie}</td>
                          <td>{reglement.montant_total_a_regler}</td>
                          <td>{reglement.num_piece_a_regler}</td>
                          <td>
                            {new Date(
                              reglement.date_piece_a_regler
                            ).toLocaleDateString()}
                          </td>
                          <td>{reglement.montant_piece_a_regler}</td>                          
                          <td>
                            <Link to={`/detailsReglementRecu/${reglement.id}`}>
                              <button type="button" className="btn btn-primary">
                                Détails
                              </button>
                            </Link>
                            &nbsp; &nbsp;
                            <Link to={`/updateReglementRecu/${reglement.id}`}>
                              <button type="button" className="btn btn-success">
                                Modifier
                              </button>
                            </Link>
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
      </div>
    </div>
  )
}

export default ReglementsRecus
