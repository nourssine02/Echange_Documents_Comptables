import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [userData, setUserData] = useState({ identite: '', role: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAuthenticatedData = async () => {
      try {
        const response = await axios.post('http://localhost:5000/login', {
          identite: 'utilisateur',
          mot_de_passe: 'motdepasse'
        });
        const { token } = response.data;
        // Appeler la route protégée avec le token JWT
        const authResponse = await axios.get('http://localhost:5000/authenticated', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUserData({
          identite: authResponse.data.identite,
          role: authResponse.data.role
        });
      } catch (error) {
        console.error(error);
        setError('Erreur lors de la récupération des données');
      }
    };

    fetchAuthenticatedData();
  }, []); 

  return (
    <div className="main-panel">
      <div className="content-wrapper">
        <div>
          {userData.identite && <h1>Bienvenue sur la page d'accueil, {userData.identite}!</h1>}
          {userData.role && <p>Votre rôle : {userData.role}</p>}
          <p>Contenu de la page d'accueil.</p>
          {error && <div>{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default Home;
