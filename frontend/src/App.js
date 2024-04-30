import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Dashboard/Navbar";
import Sidebar from "./components/Dashboard/Sidebar";
import Home from "./components/Home/Home";
import Utilisateurs from "./components/Utilisateurs/Utilisateurs";
import Register from "./components/Connexion/Register";
import Login from "./components/Connexion/Login";
import AddEntreprise from "./components/Entreprises/AddEntreprise";
import UpdateEntreprise from "./components/Entreprises/UpdateEntreprise";
import DetailsEntreprise from "./components/Entreprises/DetailsEntreprise";
import Entreprises from "./components/Entreprises/Entreprises";
import AddUser from "./components/Utilisateurs/AddUser";
import UpdateUser from "./components/Utilisateurs/UpdateUser";
import Tiers from "./components/Tiers/Tiers";
import AddTier from "./components/Tiers/AddTier";
import UpdateTier from "./components/Tiers/UpdateTier";
import Achats from "./components/Achats/Achats";
import AddAchat from "./components/Achats/AddAchat";
import DetailsAchat from "./components/Achats/DetailsAchat";
import UpdateAchat from "./components/Achats/UpdateAchat";
import ReglementsEmis from "./components/Reglements Emis/ReglementsEmis";
import DetailsReglement from "./components/Reglements Emis/DetailsReglement";
import ReglementsRecus from "./components/Reglements Recus/ReglementsRecus";
import AddReglementRecu from "./components/Reglements Recus/AddReglementRecu";
import AddReglement from "./components/Reglements Emis/AddReglement";
import UpdateReglement from "./components/Reglements Emis/UpdateReglement";
import Commandes from "./components/Commandes/Commandes";
import AddCommande from "./components/Commandes/AddCommande";
import Livraisons from "./components/Livraisons/Livraisons";
import AddLivraison from "./components/Livraisons/AddLivraison";
import Facturations from "./components/Facturations/Facturations";
import AddFacture from "./components/Facturations/AddFacture";
import DetailsCommande from "./components/Commandes/DetailsCommande";
import UpdateCommande from "./components/Commandes/UpdateCommande";
import UpdateLivraison from "./components/Livraisons/UpdateLivraison";
import DetailsLivraison from "./components/Livraisons/DetailsLivraison";
import NotFound from "./components/Connexion/NotFound";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="*"
          element={
            <div className="container-fluid page-body-wrapper">
              <Navbar />
              <Sidebar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/entreprises" element={<Entreprises />} />
                <Route path="/addEntreprise" element={<AddEntreprise />} />
                <Route
                  path="/updateEntreprise/:id"
                  element={<UpdateEntreprise />}
                />
                <Route
                  path="/detailsEntreprise/:id"
                  element={<DetailsEntreprise />}
                />
                <Route path="/users" element={<Utilisateurs />} />
                <Route path="/addUser" element={<AddUser />} />
                <Route path="/updateUser/:id" element={<UpdateUser />} />
                <Route path="/tiers" element={<Tiers />} />
                <Route path="/addTier" element={<AddTier />} />
                <Route path="/updateTier/:id" element={<UpdateTier />} />
                <Route path="/achats" element={<Achats />} />
                <Route path="/addAchat" element={<AddAchat />} />
                <Route path="/detailsAchat/:id" element={<DetailsAchat />} />
                <Route path="/updateAchat/:id" element={<UpdateAchat />} />
                <Route path="/reglements_emis" element={<ReglementsEmis />} />
                <Route path="/addReglement" element={<AddReglement />} />
                <Route
                  path="/detailsReglement/:id"
                  element={<DetailsReglement />}
                />
                <Route
                  path="/updateReglement/:id"
                  element={<UpdateReglement />}
                />
                <Route path="/commandes" element={<Commandes />} />
                <Route path="/addCommande" element={<AddCommande />} />
                <Route
                  path="/detailsCommande/:id"
                  element={<DetailsCommande />}
                />
                <Route
                  path="/updateCommande/:id"
                  element={<UpdateCommande />}
                />
                <Route path="/livraisons" element={<Livraisons />} />
                <Route path="/addLivraison" element={<AddLivraison />} />
                <Route
                  path="/updateLivraison/:id"
                  element={<UpdateLivraison />}
                />
                <Route
                  path="/DetailsLivraison/:id"
                  element={<DetailsLivraison />}
                />
                <Route path="/facturations" element={<Facturations />} />
                <Route path="/addFacture" element={<AddFacture />} />
                <Route path="/reglements_recus" element={<ReglementsRecus />} />
                <Route
                  path="/addReglementRecu"
                  element={<AddReglementRecu />}
                />
                {/* <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />*/}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
