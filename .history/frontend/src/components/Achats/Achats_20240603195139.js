import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../Connexion/UserProvider";
import ReactPaginate from 'react-paginate';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '';
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from '../components/dropdown';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/solid';
import "./Achats.css";

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
    <div className="main-panel">
      <div className="content-wrapper">
        <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h2 className="font-medium text-center mb-5">Liste des Achats de Biens et de Services</h2>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="input-group" style={{ maxWidth: "300px" }}>
                    <input
                      type="search"
                      className="form-control"
                      placeholder="Search events..."
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
                      <button type="button" className="btn btn-dark">Ajouter un Achat</button>
                    </Link>
                  )}
                </div>
                <div className="table-responsive pt-3">
                  <Table className="[--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]">
                    <TableHead>
                      <TableRow>
                        <TableHeader>Ajouté par</TableHeader>
                        <TableHeader>Date de Saisie</TableHeader>
                        <TableHeader>Code Tiers</TableHeader>
                        <TableHeader>Type de la Pièce</TableHeader>
                        <TableHeader>N° de la Pièce</TableHeader>
                        <TableHeader>Date de la Pièce</TableHeader>
                        <TableHeader>Statut</TableHeader>
                        <TableHeader>Montant Total de la Pièce</TableHeader>
                        <TableHeader className="relative w-0">
                          <span className="sr-only">Actions</span>
                        </TableHeader>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentItems.map((achat) => (
                        <TableRow key={achat.id}>
                          <TableCell className="font-medium">{achat.identite}</TableCell>
                          <TableCell>{new Date(achat.date_saisie).toLocaleDateString()}</TableCell>
                          <TableCell>{achat.code_tiers}</TableCell>
                          <TableCell>{achat.type_piece}</TableCell>
                          <TableCell>{achat.num_piece}</TableCell>
                          <TableCell>{new Date(achat.date_piece).toLocaleDateString()}</TableCell>
                          <TableCell style={{ color: achat.statut === "non réglée" ? "red" : "green" }}>
                            {achat.statut}
                          </TableCell>
                          <TableCell>{achat.montant_total_piece} DT</TableCell>
                          <TableCell>
                            <div className="-mx-3 -my-1.5 sm:-mx-2.5">
                              <Dropdown>
                                <DropdownButton plain aria-label="More options">
                                  <EllipsisHorizontalIcon />
                                </DropdownButton>
                                <DropdownMenu anchor="bottom end">
                                  <DropdownItem>
                                    <Link to={`/detailsAchat/${achat.id}`}>Détails</Link>
                                  </DropdownItem>
                                  {user.role !== "comptable" && (
                                    <DropdownItem>
                                      <Link to={`/updateAchat/${achat.id}`}>Modifier</Link>
                                    </DropdownItem>
                                  )}
                                </DropdownMenu>
                              </Dropdown>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
