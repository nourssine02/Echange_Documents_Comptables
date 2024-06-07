import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Connexion/Login';
import Register from './components/Connexion/Register';
import ProtectedRoutes from './components/Connexion/ProtectedRoutes';
import { UserProvider } from './components/Connexion/UserProvider';
import NotFoundPage from "./components/Connexion/Error Pages/NotFoundPage";
import UploadFile from './components/Pointage Personnel/UploadFile';
import FichePaie from './components/Pointage Personnel/FichePaie';
const App = () => {
  return (
    <UserProvider>
      <Router>  
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/*" element={<ProtectedRoutes />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/UploadFile " element={<UploadFile />}/>
          <Route path="/FichePaie" element={<FichePaie />}/>
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
