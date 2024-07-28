import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Connexion/Login';
import Register from './components/Connexion/Register';
import ProtectedRoutes from './components/Connexion/ProtectedRoutes';
import { UserProvider } from './components/Connexion/UserProvider';
import NotFoundPage from "./components/Connexion/Error Pages/NotFoundPage";
import ForgotPassword from './components/Connexion/ForgotPassword';
import ResetPassword from './components/Connexion/ResetPassword';
const App = () => {
  return (
    <UserProvider>
      <Router>  
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register" element={<Register />} />
          <Route path="/*" element={<ProtectedRoutes />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/forget_pass" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} /> 
         
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
