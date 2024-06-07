import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Utilisateurs = ({isSidebarOpen}) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/utilisateurs");
        setUsers(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete("http://localhost:5000/users/" + id);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  const confirmDelete = (id) => {
    const confirmDelete = window.confirm(
      "Voulez-vous vraiment supprimer ce utilisateur  ?"
    );
    if (confirmDelete) {
      handleDelete(id);
    }
  };

  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? 'shifted' : ''}`}>
      <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h2 className="titre">Liste des Utilisateurs</h2>
                <br></br>
                <p className="card-description">
                  <Link to="/addUser">
                    <button type="button" className="btn btn-info">
                      Ajouter un Utilisateur
                    </button>
                  </Link>
                </p>
                <div className="table-responsive pt-3">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Code Utilisateur</th>
                      <th>Code_entreprise</th>
                      <th>Identite</th>
                      <th>Position</th>
                      <th>Telephone</th>
                      <th>Email</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.code_user}</td>
                        <td>{user.code_entreprise}</td>
                        <td>{user.identite}</td>
                        <td>{user.position}</td>
                        <td>{user.tel}</td>
                        <td>{user.email}</td>
                        <td>
                          <Link to={`/updateUser/${user.id}`}>
                            <button type="button" className="btn btn-success">
                              Modifier
                            </button>
                          </Link>
                          &nbsp;
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => confirmDelete(user.id)}
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

export default Utilisateurs;
