import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../Connexion/UserProvider";
import ReactPaginate from 'react-paginate';
import { MDBInputGroup, MDBAutocomplete, MDBIcon, MDBBtn } from 'mdb-react-ui-kit';

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

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(0); // Reset to first page on new search
  };

  const filteredAchats = achats.filter((achat) =>
    achat.identite.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const offset = currentPage * itemsPerPage;
  const currentItems = filteredAchats.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredAchats.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const searchData = achats.map((achat) => achat.identite);

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
                <br />
                {user.role !== "comptable" && (
                  <p className="card-description">
                    <Link to="/addAchat">
                      <button type="button" className="btn btn-info">
                        Ajouter un Achat
                      </button>
                    </Link>
                  </p>
                )}
                <MDBInputGroup>
                  <MDBAutocomplete
                    label='Rechercher...'
                    dataFilter={(value) => {
                      handleSearchChange(value);
                      return searchData.filter((item) => {
                        return item.toLowerCase().startsWith(value.toLowerCase());
                      });
                    }}
                    clearOnBlur={false}
                  />
                  <MDBBtn rippleColor='dark'>
                    <MDBIcon icon='search' />
                  </MDBBtn>
                </MDBInputGroup>
                <div className="table-responsive pt-3">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Ajouté par</th>
                        <th>Date de Saisie</th>
                        <th>Code Tiers</th>
                        <th>
                          Type de la <br />Pièce
                        </th>
                        <th>
                          N° de la <br />Pièce
                        </th>
                        <th>
                          Date de la <br /> Pièce
                        </th>
                        <th>Statut</th>
                        <th>
                          Montant Total de <br />la Pièce
                        </th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((achat) => (
                        <React.Fragment key={achat.id}>
                          <tr>
                            <td>{achat.identite}</td>
                            <td>{new Date(achat.date_saisie).toLocaleDateString()}</td>
                            <td>{achat.code_tiers}</td>
                            <td>{achat.type_piece}</td>
                            <td>{achat.num_piece}</td>
                            <td>{new Date(achat.date_piece).toLocaleDateString()}</td>
                            <td
                              style={{
                                color: achat.statut === "non réglée" ? "red" : "green",
                              }}
                            >
                              {achat.statut}
                            </td>
                            <td>{achat.montant_total_piece} DT</td>
                            <td>
                              <Link to={`/detailsAchat/${achat.id}`}>
                                <button type="button" className="btn btn-primary ml-2">
                                  Détails
                                </button>
                              </Link>
                              &nbsp;
                              {user.role !== "comptable" && (
                                <Link to={`/updateAchat/${achat.id}`}>
                                  <button type="button" className="btn btn-success">
                                    Modifier
                                  </button>
                                </Link>
                              )}
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
                <br />
                <div style={{ marginLeft: "700px", marginTop: "200px" }}>
                  <ReactPaginate
                    previousLabel={'← Précédent'}
                    nextLabel={'Suivant →'}
                    breakLabel={'...'}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}
                    onPageChange={handlePageClick}
                    containerClassName={'pagination justify-content-center'}
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
        </div>
      </div>
    </div>
  );
};

export default Achats;
