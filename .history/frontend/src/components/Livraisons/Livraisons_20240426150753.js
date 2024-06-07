import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Livraisons = () => {
  const [livraisons, setLivraisons] = useState([]);

  useEffect(() => {
    const fetchLivraisons = async () => {
      try {
        const res = await axios.get("http://localhost:5000/livraisons");
        console.log(res.data);
        setLivraisons(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchLivraisons();
  }, []);

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h2 className="titre">Liste des Livraisons</h2>
                <br></br>
                <p className="card-description">
                  <Link to="/addLivraison">
                    <button type="button" className="btn btn-info">
                      Ajouter une Livraison
                    </button>
                  </Link>
                </p>
                <div className="table-responsive pt-3">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Date du Bon de Livraison</th>
                        <th>N° du Bon de Livraison</th>
                        <th>Code Tiers</th>
                        <th>Reference Commande</th>
                        <th>
                          Montant Total du <br></br>Bon de Livraison
                        </th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {livraisons.map((livraison, index) => (
                        <tr key={index}>
                          <td>
                            {new Date(livraison.date_BL).toLocaleDateString()}
                          </td>
                          <td>{livraison.num_BL}</td>
                          <td>{livraison.code_tiers}</td>
                          <td>{livraison.reference_commande}</td>
                          <td>{livraison.montant_total_BL}</td>
                          <td>
                            <Link to={`/detailsLivraison/${livraison.id}`}>
                              <button type="button" className="btn btn-primary">
                                Détails
                              </button>
                            </Link>
                            &nbsp; &nbsp;
                            <Link to={`/updateLivraison/${livraison.id}`}>
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
  );
};

export default Livraisons;
