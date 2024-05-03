import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [identite, setIdentite] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAuthenticatedData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError('Utilisateur non authentifié.');
          return;
        }
        
        const response = await axios.get("http://localhost:5000/authenticated", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true
        });
        
        setIdentite(response.data.identite);
      } catch (error) {
        console.error(error);
        setError('Erreur lors de la récupération des données.');
      }
    };

    fetchAuthenticatedData();
  }, []);

  const logout = () => {
    axios.post("http://localhost:5000/logout")
      .then(res => {
        localStorage.removeItem("token");
        window.location.href = "/"; 
      })
      .catch(err => {
        console.error(err);
        setError('Erreur lors de la déconnexion.');
      });
  };

  return (
    <div className="main-panel">
      <div className="content-wrapper">
          <div>
            {identite && <h1>Welcome to the Home Page {identite}</h1>}
            {!identite && <h1>Welcome to the Home Page</h1>}
            <p>This is the content of the Home Page.</p>
            {error && <div>{error}</div>}
            <button onClick={logout} className="btn btn-danger">Logout</button>
          </div>
      </div>
    </div>
  );
}

export default Home;
