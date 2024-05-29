import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Commandes = () => {
  const [commandes, setCommandes] = useState([]);

  useEffect(() => {
    const fetchCommandes = async () => {
      try {
        const res = await axios.get("http://localhost:5000/commandes");
        console.log(res.data);
        setCommandes(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCommandes();
  }, []);

  return (
    <div className="row">
      <div className="col-lg-12 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <h2 className="titre">Liste des Commandes</h2>
            <br></br>
            <p className="card-description">
              <Link to="/addCommande">
                <button type="button" className="btn btn-info">
                  Ajouter une Commande
                </button>
              </Link>
            </p>
            <div className="table-responsive pt-3">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Date de la commande</th>
                    <th>N° de la commande</th>
                    <th>Code Tiers</th>
                    <th>Montant de la Commande</th>
                    <th>Date de livraison prevue</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {commandes.map((commande, index) => (
                    <tr key={index}>
                      <td>
                        {new Date(commande.date_commande).toLocaleDateString()}
                      </td>
                      <td>{commande.num_commande}</td>
                      <td>{commande.code_tiers}</td>
                      <td>{commande.montant_commande}</td>
                      <td>
                        {new Date(
                          commande.date_livraison_prevue
                        ).toLocaleDateString()}
                      </td>
                      <td>
                        <Link to={`/detailsCommande/${commande.id}`}>
                          <button type="button" className="btn btn-primary">
                            Détails
                          </button>
                        </Link>
                        &nbsp; &nbsp;
                        <Link to={`/updateCommande/${commande.id}`}>
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
  );
};

export default Commandes;
