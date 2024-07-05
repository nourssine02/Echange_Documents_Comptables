import React, { useContext, useEffect } from 'react';
import axios from 'axios';
import { UserContext } from '../Connexion/UserProvider';
import { useParams } from 'react-router-dom';

const Profile = () => {
    const { user , setUser } = useContext(UserContext);
    const { id } = useParams();


      



  return (
    <div>
      <h1>Profile</h1>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
    </div>
  );
};

export default Profile;
