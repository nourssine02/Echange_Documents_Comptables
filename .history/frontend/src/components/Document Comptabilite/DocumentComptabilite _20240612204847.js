import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../Connexion/UserProvider";

const DocumentComptabilite = ({isSidebarOpen}) => {
  const [documents, setDocuments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(5);
  const { user } = useContext(UserContext);


  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const res = await axios.get("http://localhost:5000/documents_comptabilite");
        setDocuments(res.data);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };
    fetchDocuments();
  }, [user]);

  const VoirDocument = (id) => {
    const document = documents.find((doc) => doc.id === id);
    const imageUrl = document && document.document_fichier;
    console.log(imageUrl);

    if (imageUrl) {
      setShowModal(true);
      setModalImageUrl(imageUrl);
    } else {
      console.error("Document image URL not found");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setModalImageUrl("");
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
  };


  const filtered = documents.filter((document) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      document.nature.toLowerCase().includes(searchTermLower) ||
      document.des.toLowerCase().includes(searchTermLower) ||
      reglement.num_facture.toLowerCase().includes(searchTermLower) ||
      new Date(document.date).toLocaleDateString().includes(searchTermLower) ||
      reglement.montant_total_a_regler.toString().includes(searchTermLower) ||
      reglement.montant_total_facture.toString().includes(searchTermLower) 
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
                <h2 className="titre text-center">Liste des Documents Comptables</h2>
                <br></br>
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
                    <Link to="/addDocCompta">
                      <button type="button" className="btn btn-dark">
                        Ajouter un Document
                      </button>
                    </Link>
                  
                </div>
                <div className="table-responsive pt-3">
                  <table className="table table-sm table-hover">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Nature</th>
                        <th>Désignation</th>
                        <th>Destinataire</th>
                        <th>Priorité</th>
                        <th>Observations</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {documents.map((doc) => (
                        <tr key={doc.id}>
                          <td>
                          {new Date(doc.date).toLocaleDateString()}
                          </td>
                          <td>{doc.nature}</td>
                          <td>{doc.designation}</td>
                          <td>{doc.destinataire}</td>
                          <td>{doc.priorite}</td>
                          <td>{doc.observations}</td>
                          <td>
                            <Link to={`/updateDocCompta/${doc.id}`}>
                              <button className="btn btn-success">Modifier</button>
                            </Link>
                            <button className="btn btn-danger ml-2" onClick={() => VoirDocument(doc.id)}>
                              Voir Document
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

      {showModal && (
        <div className="modal" style={{ display: "block" , marginTop: "-30px"}}>
          <div className="modal-dialog modal-ms">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Document</h5>
                <button type="button" className="close" onClick={closeModal}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body" style={{ maxHeight: "78vh", overflowY: "auto" }}>
                <img src={modalImageUrl} alt="Document" style={{ width: "100%" }} />
              </div>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentComptabilite;
