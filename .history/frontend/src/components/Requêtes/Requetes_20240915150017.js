import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../Connexion/UserProvider';

const Requetes = () => {
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);
  
  return (
    <div>
      
    </div>
  )
}

export default Requetes
