import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../Connexion/UserProvider";
import ReactPaginate from 'react-paginate';

const Achats = () => {
  const [achats, setAchats] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(5);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchAchats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/achats", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
  };

  const filteredAchats = achats.filter((achat) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      achat.identite.toLowerCase().includes(searchTermLower) ||
      new Date(achat.date_saisie).toLocaleDateString().includes(searchTermLower) ||
      achat.montant_total_piece.toString().includes(searchTermLower) ||
      achat.statut.toLowerCase().includes(searchTermLower) ||
      achat.num_piece.toLowerCase().includes(searchTermLower) ||
      achat.code_tiers.toLowerCase().includes(searchTermLower) ||
      achat.type_piece.toLowerCase().includes(searchTermLower) ||
      new Date(achat.date_piece).toLocaleDateString().includes(searchTermLower)
    );
  });

  const offset = currentPage * itemsPerPage;
  const currentItems = filteredAchats.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredAchats.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="container my-5">
      <div className="card shadow">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Liste des Achats de Biens et de Services</h2>
          {user.role !== "comptable" && (
            <div className="mb-4 text-right">
              <Link to="/addAchat">
                <button type="button" className="btn btn-primary">
                  Ajouter un Achat
                </button>
              </Link>
            </div>
          )}
          <div className="d-flex justify-content-end mb-4">
            <div className="input-group">
              <input
                type="search"
                className="form-control"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <div className="input-group-append">
                <span className="input-group-text"><i className="fas fa-search"></i></span>
              </div>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Ajouté par</th>
                  <th>Date de Saisie</th>
                  <th>Code Tiers</th>
                  <th>Type de la Pièce</th>
                  <th>N° de la Pièce</th>
                  <th>Date de la Pièce</th>
                  <th>Statut</th>
                  <th>Montant Total de la Pièce</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((achat) => (
                  <tr key={achat.id}>
                    <td>{achat.identite}</td>
                    <td>{new Date(achat.date_saisie).toLocaleDateString()}</td>
                    <td>{achat.code_tiers}</td>
                    <td>{achat.type_piece}</td>
                    <td>{achat.num_piece}</td>
                    <td>{new Date(achat.date_piece).toLocaleDateString()}</td>
                    <td style={{ color: achat.statut === "non réglée" ? "red" : "green" }}>
                      {achat.statut}
                    </td>
                    <td>{achat.montant_total_piece} DT</td>
                    <td className="d-flex">
                      <Link to={`/detailsAchat/${achat.id}`}>
                        <button type="button" className="btn btn-info btn-sm mr-2">
                          Détails
                        </button>
                      </Link>
                      {user.role !== "comptable" && (
                        <Link to={`/updateAchat/${achat.id}`}>
                          <button type="button" className="btn btn-success btn-sm">
                            Modifier
                          </button>
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-center mt-4">
            <ReactPaginate
              previousLabel={'← Précédent'}
              nextLabel={'Suivant →'}
              breakLabel={'...'}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={3}
              onPageChange={handlePageClick}
              containerClassName={'pagination'}
              pageClassName={'page-item'}
              pageLinkClassName={'page-link'}
              previousClassName={'page-item'}
              previousLinkClassName={'page-link'}
              nextClassName={'page-item'}
              nextLinkClassName={'page-link'}
              breakClassName={'page-item'}
              breakLinkClassName={'page-link'}
              activeClassName={'active'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achats;
