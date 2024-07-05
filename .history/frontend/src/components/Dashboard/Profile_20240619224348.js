import React, { useContext, useEffect } from 'react';
import axios from 'axios';
import { UserContext } from '../Connexion/UserProvider';

const Profile = () => {
    const { user , setUser } = useContext(UserContext);

    useEffect(() => {
        // Remplacer l'URL par celle de votre endpoint backend
        axios.get('http://localhost:5000/api/profile', { withCredentials: true })
          .then(response => {
            setUser(response.data);
          })
          .catch(error => {
            console.error('There was an error fetching the user data!', error);
          });
      }, []);


  return (
    <div>
      <h1>Profile</h1>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
    </div>
  );
};

export default Profile;
