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
          Authorization: `Bearer ${token}`, // Assurez-vous que le token est bien inclus ici
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
          {userData.identite && <h1>Bienvenue sur la page d'accueil, {userData.identite}!</h1>}
          {userData.role && <p>Votre rôle : {userData.role}</p>}
          <p>Ceci est le contenu de la page d'accueil.</p>
          {error && <div className="error">{error}</div>}
          <button onClick={logout} className="btn btn-danger">Se déconnecter</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
