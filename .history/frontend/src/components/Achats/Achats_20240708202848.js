import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { UserContext } from "../Connexion/UserProvider";
import ReactPaginate from "react-paginate";
import SelectionClient from "./../Dashboard/SelectionClient";
import "./Achats.css";

const Achats = ({ isSidebarOpen }) => {
  const [achats, setAchats] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(5);
  const { user, selectedClient } = useContext(UserContext);
  const [showModal, setShowModal] = useState(true); // Afficher le modal par défaut
  const [ajouteurFilter, setAjouteurFilter] = useState("");
  const [ajouteurs, setAjouteurs] = useState([]);

  useEffect(() => {
    const fetchAchats = async () => {
      try {
        let url = "http://localhost:5000/achats";
        if (user.role === "comptable" && selectedClient?.id) {
          url += `?clientId=${selectedClient.id}`;
        }
        if (ajouteurFilter) {
          url += `&ajouteur=${ajouteurFilter}`;
        }

        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setAchats(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchAjouteurs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/clients");
        setAjouteurs(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchAchats();
    fetchAjouteurs();
  }, [user, selectedClient, ajouteurFilter]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0); // Réinitialiser la pagination lors de la recherche
  };

  const handleAjouteurChange = (e) => {
    setAjouteurFilter(e.target.value);
    setCurrentPage(0); // Réinitialiser la pagination lors du changement d'ajouteur
  };

  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? "shifted" : ""}`}>
        {/* Afficher le Modal de Sélection Client */}
        {showModal && <SelectionClient setShowModal={setShowModal} />}

        {/* Le reste du contenu d'Achats */}
        <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h2 className="titre text-center">
                  Liste des Achats de Biens et de Services
                </h2>
                <br />
                <div className="d-flex justify-content-between align-items-center mb-4">
                  {/* Ajouter le sélecteur pour filtrer par ajouteur */}
                  {user.role === "comptable" && (
                    <div className="form-group" style={{ maxWidth: "300px" }}>
                      <label htmlFor="ajouteurSelect">Filtrer par Ajouteur:</label>
                      <select
                        id="ajouteurSelect"
                        className="form-control"
                        value={ajouteurFilter}
                        onChange={handleAjouteurChange}
                      >
                        <option value="">Tous les Ajouteurs</option>
                        {ajouteurs.map((ajouteur) => (
                          <option key={ajouteur.id} value={ajouteur.id}>
                            {ajouteur.nom} {ajouteur.prenom}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="input-group" style={{ maxWidth: "300px" }}>
                    <input
                      type="search"
                      className="form-control"
                      placeholder="Rechercher..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                    <div className="input-group-append">
                      <span className="input-group-text">
                        <i className="fas fa-search"></i>
                      </span>
                    </div>
                  </div>
                  {user.role !== "comptable" && (
                    <Link to="/addAchat">
                      <button type="button" className="btn btn-dark">
                        Ajouter un Achat
                      </button>
                    </Link>
                  )}
                </div>
                {/* Tableau des achats */}
                {/* ... */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achats;
