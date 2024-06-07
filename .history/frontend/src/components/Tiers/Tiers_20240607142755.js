import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../Connexion/UserProvider";

const Tiers = ({isSidebarOpen}) => {
    const [tiers , setTiers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage] = useState(5);
    const { user } = useContext(UserContext);


    useEffect(() => {
        const fetchTiers = async () => {
          try {
            const res = await axios.get("http://localhost:5000/tiers", {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
            setTiers(res.data);
          } catch (err) {
            console.log(err);
          }
        };
        fetchTiers();
      }, []);


      const handleDelete = async (id) => {
        try {
          await axios.delete("http://localhost:5000/tiers/" + id);
          window.location.reload();
        } catch (err) {
          console.log(err);
        }
      };

      const confirmDelete = (id) => {
        const confirmDelete = window.confirm(
          "Voulez-vous vraiment supprimer ce Tier  ?"
        );
        if (confirmDelete) {
          handleDelete(id);
        }
      };


      const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(0);
      };
    
      const filtered = tiers.filter((tier) => {
        const searchTermLower = searchTerm.toLowerCase();
        return (
          tier.code_tiers.toLowerCase().includes(searchTermLower) ||
          new Date(tier.date_saisie)
            .toLocaleDateString()
            .includes(searchTermLower) ||
          tier.montant_total_piece.toString().includes(searchTermLower)
        );
      });
    
      const offset = currentPage * itemsPerPage;
      const currentItems = filtered.slice(offset, offset + itemsPerPage);
      const pageCount = Math.ceil(filtered.length / itemsPerPage);
    
      const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
      };

      
  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? 'shifted' : ''}`}>
      <div className="row">
        <div className="col-lg-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h2 className="titre">Liste des Tiers</h2>
              <br></br>
              <p className="card-description ">
                <Link to="/addTier">
                  <button type="button" className="btn btn-dark">
                    Ajouter un Tier
                  </button>
                </Link>
              </p>
              <div className="table-responsive pt-3">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Code tiers</th>
                      <th>Date de Creation</th>
                      <th>Type</th>
                      <th>Identite</th>
                      <th>MF / CIN</th>
                      <th>Telephone</th>
                      <th>Email</th>
                      <th>Adresse</th>
                      {/* <th>Observations</th> */}
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {tiers.map((tier) => (
                      <tr key={tier.id}>
                        <td>{tier.code_tiers}</td>
                        <td>
                          {new Date(
                            tier.date_creation
                          ).toLocaleDateString()}
                        </td>
                        <td>{tier.type}</td>
                        <td>{tier.identite}</td>
                        <td>{tier["MF/CIN"]}</td>
                        <td>{tier.tel}</td>
                        <td>{tier.email}</td>
                        <td>{tier.adresse}</td>
                        {/* <td>{tier.observations}</td> */}
                        <td>
                          <Link to={`/updateTier/${tier.id}`}>
                            <button type="button" className="btn btn-success">
                              Modifier
                            </button>
                          </Link>
                          &nbsp;
                            <button
                              type="button"
                              className="btn btn-danger"
                              onClick={() => confirmDelete(tier.id)}
                            >
                              Supprimer
                            </button>
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

export default Tiers;
