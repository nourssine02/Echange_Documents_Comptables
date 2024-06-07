import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { Container, Row, Col, Table, Form, Button, InputGroup, FormControl, Pagination } from 'react-bootstrap';

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
    <Container className="main-panel">
      <Row className="content-wrapper">
        <Col lg={12} className="grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h2 className="titre">Liste des Achats de Biens et de Services</h2>
              <br />
              <br />
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex">
                  <InputGroup className="mb-4 mt-3" noValidate>
                    <FormControl
                      type="search"
                      placeholder="Rechercher..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="form-control mr-sm-2"
                      style={{ minWidth: "250px" }}
                      aria-label="Search"
                    />
                    <InputGroup.Text><i className="fas fa-search"></i></InputGroup.Text>
                  </InputGroup>
                  <Form.Control
                    as="select"
                    className="form-control ml-2"
                    value={sortOption}
                    onChange={handleSortChange}
                  >
                    <option value="name">Trier par nom</option>
                    {/* Add more sorting options if needed */}
                  </Form.Control>
                </div>
                {user.role !== "comptable" && (
                  <Link to="/addAchat">
                    <Button variant="info">Ajouter un Achat</Button>
                  </Link>
                )}
              </div>
              <div className="table-responsive pt-3">
                <Table hover>
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
                      <th></th>
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
                        <td>
                          <Link to={`/detailsAchat/${achat.id}`}>
                            <Button variant="primary" className="ml-2">Détails</Button>
                          </Link>
                          &nbsp;
                          {user.role !== "comptable" && (
                            <Link to={`/updateAchat/${achat.id}`}>
                              <Button variant="success">Modifier</Button>
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <br />
              <div className="d-flex justify-content-center">
                <Pagination>
                  <Pagination.Prev onClick={() => handlePageClick({ selected: currentPage - 1 })}>
                    Précédent
                  </Pagination.Prev>
                  {[...Array(pageCount).keys()].map((pageNumber) => (
                    <Pagination.Item
                      key={pageNumber}
                      active={pageNumber === currentPage}
                      onClick={() => handlePageClick({ selected: pageNumber })}
                    >
                      {pageNumber + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next onClick={() => handlePageClick({ selected: currentPage + 1 })}>
                    Suivant
                  </Pagination.Next>
                </Pagination>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Achats;