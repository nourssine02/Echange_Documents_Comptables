import axios from "axios";
import React, { useContext, useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { UserContext } from "../Connexion/UserProvider";

const Entreprises = () => {
  const { user } = useContext(UserContext);

  const [entreprises, setEntreprises] = useState([]);
  
  
  useEffect(() => {
    const fetchEnterprises = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/entreprises', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data); // Log the response data to inspect its structure
        // Filter enterprises based on user's code_entreprise
        if (user.role === 'client') {
          // Assuming each enterprise has a field like 'clientId' indicating the client it belongs to
          const filteredEnterprises = response.data.enterprises.filter(enterprise => enterprise.code_entreprise === user.code_entreprise);
          setEntreprises(filteredEnterprises);
        } else {
          setEntreprises(response.data.enterprises);
        }
      } catch (error) {
        console.error('Error fetching enterprises:', error);
      }
    };
    
    fetchEnterprises();
  }, [user]);
  
  


  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h2 className="titre">Liste des Entreprises</h2>
                <br></br>
                <p className="card-description">
                  <Link to="/addEntreprise">
                    <button type="button" className="btn btn-info">
                      Ajouter une Entreprise
                    </button>
                  </Link>
                </p>
                <div className="table-responsive pt-3">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Code Entreprise</th>
                        <th>Date de Creation</th>
                        <th>Identite</th>
                        <th>Responsable</th>
                        <th>Adresse</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {entreprises.map((entreprise) => (
                        <tr key={entreprise.id}>
                          <td>{entreprise.code_entreprise}</td>
                          <td>
                            {new Date(
                              entreprise.date_creation
                            ).toLocaleDateString()}
                          </td>
                          <td>{entreprise.identite}</td>
                          <td>{entreprise.responsable}</td>
                          <td>{entreprise.adresse}</td>
                          <td>
                          <Link to={`/detailsEntreprise/${entreprise.id}`}>
                              <button type="button" className="btn btn-primary">
                                Details
                              </button>
                            </Link>
                            &nbsp;
                            <Link to={`/updateEntreprise/${entreprise.id}`}>
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

export default Entreprises;
