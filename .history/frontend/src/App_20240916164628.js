import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Connexion/Login";
import Register from "./components/Connexion/Register";
import ProtectedRoutes from "./components/Connexion/ProtectedRoutes";
import { UserProvider } from "./components/Connexion/UserProvider";
import NotFoundPage from "./components/Connexion/Error Pages/NotFoundPage";
import ForgotPassword from "./components/Connexion/ForgotPassword";
import ResetPassword from "./components/Connexion/ResetPassword";
import SelectionClient from "./components/Dashboard/SelectionClient";
import Achats from "./components/Achats/Achats"; // Votre page Achats

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Route publique - Page de connexion */}
          <Route path="/" element={<Login />} />

          {/* Route publique - Enregistrement */}
          <Route path="/register" element={<Register />} />

          {/* Route publique - Mot de passe oublié */}
          <Route path="/forget_pass" element={<ForgotPassword />} />

          {/* Route publique - Réinitialisation du mot de passe */}
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Route protégée */}
          <Route path="/selection-client" element={<ProtectedRoutes><SelectionClient /></ProtectedRoutes>} />
          <Route path="/achats" element={<ProtectedRoutes><Achats /></ProtectedRoutes>} />

          {/* Page NotFound */}
          <Route path="/404" element={<NotFoundPage />} />

          {/* Redirection vers /404 si aucune route ne correspond */}
          <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
