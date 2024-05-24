import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../Connexion/UserProvider";

const Achats = () => {
  const [achats, setAchats] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchAchats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/achats", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        setAchats(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAchats();
  }, [user]);

  if (!user) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h2 className="titre">
                  Liste des Achats de Biens et de Services
                </h2>
                {user.role !== 'client' && (
                  <p className="card-description">
                    <Link to="/addAchat">
                      <button type="button" className="btn btn-info">
                        Ajouter un Achat
                      </button>
                    </Link>
                  </p>
                )}
                <div className="table-responsive pt-3">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Date de Saisie</th>
                        <th>Code Tiers</th>
                        <th>Type de la Pièce</th>
                        <th>N° de la Pièce</th>
                        <th>Date de la Pièce</th>
                        <th>Statut</th>
                        <th>
                          Montant Total <br></br>de la Pièce
                        </th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {achats.map((achat) => (
                        <tr key={achat.id}>
                          <td>
                            {new Date(achat.date_saisie).toLocaleDateString()}
                          </td>
                          <td>{achat.code_tiers}</td>
                          <td>{achat.type_piece}</td>
                          <td>{achat.num_piece}</td>
                          <td>
                            {new Date(achat.date_piece).toLocaleDateString()}
                          </td>
                          <td
                            style={{
                              color:
                                achat.statut === "non réglée" ? "red" : "green",
                            }}
                          >
                            {achat.statut}
                          </td>
                          <td>{achat.montant_total_piece}</td>
                          <td>
                            <Link to={`/detailsAchat/${achat.id}`}>
                              <button type="button" className="btn btn-primary">
                                Détails
                              </button>
                            </Link>
                            {user.role !== 'client' && (
                              <>
                                &nbsp;
                                <Link to={`/updateAchat/${achat.id}`}>
                                  <button type="button" className="btn btn-success">
                                    Modifier
                                  </button>
                                </Link>
                              </>
                            )}
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

export default Achats;
