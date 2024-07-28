import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../Connexion/UserProvider";
import ReactPaginate from "react-paginate";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Tiers = ({ isSidebarOpen }) => {
  const [tiers, setTiers] = useState([]);
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
  }, [user]);

  const handleDelete = async (id) => {
    try {
      await axios.delete("http://localhost:5000/tiers/" + id);
      toast.success("Tier supprimé avec succès");
      setTiers(tiers.filter(tier => tier.id !== id));
    } catch (err) {
      if (err.response && err.response.data.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error("Le tier ne peut pas être supprimé car il est associé à des enregistrements dans d'autres tables.");
      }
      console.log(err);
    }
  };
  

  const confirmDelete = (id) => {
    const confirmDelete = window.confirm(
      "Voulez-vous vraiment supprimer ce Tier ?"
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
      new Date(tier.date_creation).toLocaleDateString().includes(searchTermLower) ||
      tier.type.toString().includes(searchTermLower) ||
      tier.identite.toString().includes(searchTermLower) ||
      tier["MF/CIN"].toString().includes(searchTermLower) ||
      tier.tel.toString().includes(searchTermLower)
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
                <h2 className="titre text-center">Liste des Tiers</h2>
                <br />
                <br />
                <div className="d-flex justify-content-between align-items-center mb-4">
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
                  <Link to="/addTier">
                    <button type="button" className="btn btn-dark ml-2">
                      Ajouter un Tier
                    </button>
                  </Link>
                </div>
                <div className="table-responsive pt-4">
                  <table className="table table-sm table-hover">
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
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.map((tier) => (
                        <tr key={tier.id}>
                          <td>{tier.code_tiers}</td>
                          <td>{new Date(tier.date_creation).toLocaleDateString()}</td>
                          <td>{tier.type}</td>
                          <td>{tier.identite}</td>
                          <td>{tier["MF/CIN"]}</td>
                          <td>{tier.tel}</td>
                          <td>{tier.email}</td>
                          <td>{tier.adresse}</td>
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
                <div className="d-flex justify-content-center mt-5">
                  <ReactPaginate
                    previousLabel={"← Précédent"}
                    nextLabel={"Suivant →"}
                    breakLabel={"..."}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination justify-content-center"}
                    pageClassName={"page-item"}
                    pageLinkClassName={"page-link"}
                    previousClassName={"page-item"}
                    previousLinkClassName={"page-link"}
                    nextClassName={"page-item"}
                    nextLinkClassName={"page-link"}
                    breakClassName={"page-item"}
                    breakLinkClassName={"page-link"}
                    activeClassName={"active"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Tiers;
