import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Connexion/Login';
import Register from './components/Connexion/Register';
import ProtectedRoutes from './components/Connexion/ProtectedRoutes';
import { UserProvider } from './components/Connexion/UserProvider';

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/*" element={<ProtectedRoutes />} />
          <Err/>
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
