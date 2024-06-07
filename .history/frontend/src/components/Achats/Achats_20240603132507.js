import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { MDBInput, MDBInputGroup, MDBIcon } from 'mdbreact';

const Achats = ({ user, achats }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('name');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const filteredAchats = achats.filter((achat) =>
    achat.identite.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedAchats = filteredAchats.sort((a, b) => {
    if (sortOption === 'name') {
      return a.identite.localeCompare(b.identite);
    }
    // Add more sorting options if needed
    return 0;
  });

  const offset = currentPage * itemsPerPage;
  const currentItems = sortedAchats.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(sortedAchats.length / itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

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
                <br />
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="d-flex">
                    <MDBInputGroup className="mb-4 mt-3" noBorder>
                      <MDBInput
                        type="search"
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="form-control mr-sm-2"
                        style={{ minWidth: "250px" }}
                        aria-label="Search"
                      />
                      <MDBIcon icon="search" style={{ marginLeft: "-35px", marginTop: "15px", cursor: "pointer" }} />
                    </MDBInputGroup>
                    <select
                      className="form-control ml-2"
                      value={sortOption}
                      onChange={handleSortChange}
                    >
                      <option value="name">Trier par nom</option>
                      {/* Add more sorting options if needed */}
                    </select>
                  </div>
                  {user.role !== "comptable" && (
                    <Link to="/addAchat">
                      <button type="button" className="btn btn-info">
                        Ajouter un Achat
                      </button>
                    </Link>
                  )}
                </div>
                <div className="table-responsive pt-3">
                  <table className="table table-sm table-hover">
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
                <div className="d-flex justify-content-center">
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