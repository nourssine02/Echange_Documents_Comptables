import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../Connexion/UserProvider";
import ReactPaginate from 'react-paginate';
import { MDBInputGroup, MDBInput, MDBIcon } from 'mdb-react-ui-kit';



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
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-center mb-6">Liste des Achats de Biens et de Services</h2>
        {user.role !== "comptable" && (
          <div className="mb-4 text-right">
            <Link to="/addAchat">
              <button type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Ajouter un Achat
              </button>
            </Link>
          </div>
        )}
        <div className="flex justify-end mb-4">
          <MDBInputGroup className="flex items-center">
            <MDBInput
              type="search"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="form-control mr-2"
            />
            <MDBIcon icon="search" className="cursor-pointer" />
          </MDBInputGroup>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b-2">Ajouté par</th>
                <th className="py-2 px-4 border-b-2">Date de Saisie</th>
                <th className="py-2 px-4 border-b-2">Code Tiers</th>
                <th className="py-2 px-4 border-b-2">Type de la Pièce</th>
                <th className="py-2 px-4 border-b-2">N° de la Pièce</th>
                <th className="py-2 px-4 border-b-2">Date de la Pièce</th>
                <th className="py-2 px-4 border-b-2">Statut</th>
                <th className="py-2 px-4 border-b-2">Montant Total de la Pièce</th>
                <th className="py-2 px-4 border-b-2"></th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((achat) => (
                <tr key={achat.id}>
                  <td className="py-2 px-4 border-b">{achat.identite}</td>
                  <td className="py-2 px-4 border-b">{new Date(achat.date_saisie).toLocaleDateString()}</td>
                  <td className="py-2 px-4 border-b">{achat.code_tiers}</td>
                  <td className="py-2 px-4 border-b">{achat.type_piece}</td>
                  <td className="py-2 px-4 border-b">{achat.num_piece}</td>
                  <td className="py-2 px-4 border-b">{new Date(achat.date_piece).toLocaleDateString()}</td>
                  <td className="py-2 px-4 border-b" style={{ color: achat.statut === "non réglée" ? "red" : "green" }}>
                    {achat.statut}
                  </td>
                  <td className="py-2 px-4 border-b">{achat.montant_total_piece} DT</td>
                  <td className="py-2 px-4 border-b flex space-x-2">
                    <Link to={`/detailsAchat/${achat.id}`}>
                      <button type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">
                        Détails
                      </button>
                    </Link>
                    {user.role !== "comptable" && (
                      <Link to={`/updateAchat/${achat.id}`}>
                        <button type="button" className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded">
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
        <div className="flex justify-center mt-6">
          <ReactPaginate
            previousLabel={'← Précédent'}
            nextLabel={'Suivant →'}
            breakLabel={'...'}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            containerClassName={'pagination flex'}
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
  );
};

export default Achats;
