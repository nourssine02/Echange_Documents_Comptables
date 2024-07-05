import React, { useContext, useEffect } from 'react';
import axios from 'axios';
import { UserContext } from '../Connexion/UserProvider';

const Profile = () => {
    const { user , setUser } = useContext(UserContext);

    useEffect(() => {
        axios
          .get("http://localhost:5000/entreprises/" + id)
          .then((res) => {
            const data = res.data[0];
            setEntreprise({
              code_entreprise: data.code_entreprise,
              date_creation: data.date_creation,
              identite: data.identite,
              MF_CIN: data["MF/CIN"],
              responsable: data.responsable,
              cnss: data.cnss,
              tel: data.tel,
              email: data.email,
              adresse: data.adresse,
            });
          })
          .catch((err) => console.log(err));
      }, [id]);
    ;


  return (
    <div>
      <h1>Profile</h1>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
    </div>
  );
};

export default Profile;
