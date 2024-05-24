import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import ProtectedRoutes from './ProtectedRoutes';
import { UserProvider } from './components/Connexion/UserProvider';

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/*" element={<ProtectedRoutes />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
