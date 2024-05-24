// App.jsx
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Login from "./components/Connexion/Login";
import Register from "./components/Connexion/Register"
import { UserProvider } from "./components/Connexion/UserProvider";
import ProtectedRoutes from "./components/Connexion/ProtectedRoutes";

const App = () => {
  
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/*" element={<ProtectedRoutes />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
};

export default App;
