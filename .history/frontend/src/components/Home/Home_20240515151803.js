import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [userData, setUserData] = useState({ identite: '', role: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAuthenticatedData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Utilisateur non authentifié.');
          return;
        }

        const response = await axios.get('http://localhost:5000/authenticated', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.user) {
          setUserData({
            identite: response.data.user.identite,
            role: response.data.user.role,
          });
        } else {
          setError('Utilisateur non authentifié.');
        }
      } catch (error) {
        if (error.response && error.response.status === 403) {
          setError('Token invalide. Veuillez vous reconnecter.');
        } else {
          setError('Erreur lors de la récupération des données.');
        }
      }
    };

    fetchAuthenticatedData();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <div>
          {userData.identite && <h1>Welcome to the Home Page {userData.identite}</h1>}
          {userData.role && <p>Your role: {userData.role}</p>}

          <p>This is the content of the Home Page.</p>
          {error && <div className="error">{error}</div>}
          <button onClick={logout} className="btn btn-danger">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
