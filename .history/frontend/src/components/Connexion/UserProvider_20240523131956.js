import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:5000/home", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }); 

        setUser(response.data.user);
      } catch (error) {
        console.log("Erreur lors de la récupération des données de l'utilisateur :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center', 
            alignItems: 'center',
            height: '100vh',
            width: '100vw',
          }}
        >
          <CircularProgress />
        </div>
      </Box>
    );
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
