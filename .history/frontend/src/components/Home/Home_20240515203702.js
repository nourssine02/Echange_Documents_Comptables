// Home.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Home() {
  const [userData, setUserData] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Utilisateur non authentifié');
          return;
        }

        const response = await axios.get('http://localhost:5000/home', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(response.data.user);
      } catch (error) {
        setError('Erreur lors de la récupération des données');
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div className="main-panel">
      <div className="content-wrapper">
      <h2>Home</h2>
      {userData && (
        <div>
          <p>Identité: {userData.identite}</p>
          <p>Rôle: {userData.role}</p>
        </div>
      )}
      {error && <div>{error}</div>}
      <button onClick={handleLogout}>Se déconnecter</button>
    </div>
    </div>
  );
}

export default Home;
