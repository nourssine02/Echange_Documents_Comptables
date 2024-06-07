import React, { useContext, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Sidebar from "../Dashboard/Sidebar";
import Navbar from "../Dashboard/Navbar";
import Home from "../Home/Home";
import Entreprises from "../Entreprises/Entreprises";
import AddEntreprise from "../Entreprises/AddEntreprise";
import UpdateEntreprise from "../Entreprises/UpdateEntreprise";
import DetailsEntreprise from "../Entreprises/DetailsEntreprise";
import Utilisateurs from "../Utilisateurs/Utilisateurs";
import AddUser from "../Utilisateurs/AddUser";
import UpdateUser from "../Utilisateurs/UpdateUser";
import Tiers from "../Tiers/Tiers";
import AddTier from "../Tiers/AddTier";
import UpdateTier from "../Tiers/UpdateTier";
import Achats from "../Achats/Achats";
import AddAchat from "../Achats/AddAchat";
import DetailsAchat from "../Achats/DetailsAchat";
import UpdateAchat from "../Achats/UpdateAchat";
import ReglementsEmis from "../Reglements Emis/ReglementsEmis";
import DetailsReglement from "../Reglements Emis/DetailsReglement";
import ReglementsRecus from "../Reglements Recus/ReglementsRecus";
import AddReglementRecu from "../Reglements Recus/AddReglementRecu";
import AddReglement from "../Reglements Emis/AddReglement";
import UpdateReglement from "../Reglements Emis/UpdateReglement";
import Commandes from "../Commandes/Commandes";
import AddCommande from "../Commandes/AddCommande";
import Livraisons from "../Livraisons/Livraisons";
import AddLivraison from "../Livraisons/AddLivraison";
import Facturations from "../Facturations/Facturations";
import AddFacture from "../Facturations/AddFacture";
import DetailsCommande from "../Commandes/DetailsCommande";
import UpdateCommande from "../Commandes/UpdateCommande";
import UpdateLivraison from "../Livraisons/UpdateLivraison";
import DetailsLivraison from "../Livraisons/DetailsLivraison";
import { UserContext } from "./UserProvider";
import DetailsFacture from "../Facturations/DetailsFacture";
import UpdateFacture from "../Facturations/UpdateFacture";
import DetailsReglementRecu from "../Reglements Recus/DetailsReglementRecu";
import UpdateReglementRecu from "../Reglements Recus/UpdateReglementRecu";
import Versements from "../Versements/Versements";
import AddVersement from "../Versements/AddVersement";
import DetailsVersement from "../Versements/DetailsVersement";
import UpdateVersement from "../Versements/UpdateVersement";
import Pointage from "../Pointage Personnel/Pointage";
import AddPointage from "../Pointage Personnel/AddPointage";
import DocumentComptabilite from "../Document Comptabilite/DocumentComptabilite ";
import AddDocCompta from "../Document Comptabilite/AddDocCompta";
import UpdateDocCompta from "../Document Comptabilite/UpdateDocCompta";
import Configurations from "../Dashboard/Configurations";
import DocumentDirection from "../Document Direction/DocumentDirection";

const ProtectedRoutes = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const { user } = useContext(UserContext);

  if (!user) {
    return <Navigate to="/" />;
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`container-fluid page-body-wrapper ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Sidebar isSidebarOpen={isSidebarOpen} handleSidebarItemClick={toggleSidebar} />
      <Routes>
        <Route path="/home" element={<Home isSidebarOpen={isSidebarOpen} />} />
        <Route path="/entreprises" element={<Entreprises isSidebarOpen={isSidebarOpen} />} />
        <Route path="/addEntreprise" element={<AddEntreprise  isSidebarOpen={isSidebarOpen}/>} />
        <Route path="/updateEntreprise/:id" element={<UpdateEntreprise isSidebarOpen={isSidebarOpen} />} />
        <Route path="/detailsEntreprise/:id" element={<DetailsEntreprise  isSidebarOpen={isSidebarOpen}/>} />
        <Route path="/users" element={<Utilisateurs isSidebarOpen={isSidebarOpen} />} />
        <Route path="/addUser" element={<AddUser isSidebarOpen={isSidebarOpen} />} />
        <Route path="/updateUser/:id" element={<UpdateUser isSidebarOpen={isSidebarOpen} />} />
        <Route path="/tiers" element={<Tiers isSidebarOpen={isSidebarOpen} />} />
        <Route path="/addTier" element={<AddTier isSidebarOpen={isSidebarOpen} />} />
        <Route path="/updateTier/:id" element={<UpdateTier isSidebarOpen={isSidebarOpen} />} />
        <Route path="/achats" element={<Achats isSidebarOpen={isSidebarOpen} />} />
        <Route path="/addAchat" element={<AddAchat isSidebarOpen={isSidebarOpen} />} />
        <Route path="/detailsAchat/:id" element={<DetailsAchat isSidebarOpen={isSidebarOpen} />} />
        <Route path="/updateAchat/:id" element={<UpdateAchat isSidebarOpen={isSidebarOpen} />} />
        <Route path="/reglements_emis" element={<ReglementsEmis isSidebarOpen={isSidebarOpen} />} />
        <Route path="/addReglement" element={<AddReglement isSidebarOpen={isSidebarOpen} />} />
        <Route path="/detailsReglement/:id" element={<DetailsReglement isSidebarOpen={isSidebarOpen} />} />
        <Route path="/updateReglement/:id" element={<UpdateReglement isSidebarOpen={isSidebarOpen} />} />
        <Route path="/commandes" element={<Commandes isSidebarOpen={isSidebarOpen} />} />
        <Route path="/addCommande" element={<AddCommande isSidebarOpen={isSidebarOpen} />} />
        <Route path="/detailsCommande/:id" element={<DetailsCommande isSidebarOpen={isSidebarOpen} />} />
        <Route path="/updateCommande/:id" element={<UpdateCommande isSidebarOpen={isSidebarOpen} />} />
        <Route path="/livraisons" element={<Livraisons isSidebarOpen={isSidebarOpen} />} />
        <Route path="/addLivraison" element={<AddLivraison isSidebarOpen={isSidebarOpen} />} />
        <Route path="/updateLivraison/:id" element={<UpdateLivraison isSidebarOpen={isSidebarOpen} />} />
        <Route path="/detailsLivraison/:id" element={<DetailsLivraison isSidebarOpen={isSidebarOpen} />} />
        <Route path="/facturations" element={<Facturations isSidebarOpen={isSidebarOpen} />} />
        <Route path="/addFacture" element={<AddFacture isSidebarOpen={isSidebarOpen} />} />
        <Route path="/detailsFacture/:id" element={<DetailsFacture isSidebarOpen={isSidebarOpen} />} />
        <Route path="/updateFacture/:id" element={<UpdateFacture isSidebarOpen={isSidebarOpen} />} />
        <Route path="/reglements_recus" element={<ReglementsRecus isSidebarOpen={isSidebarOpen} />} />
        <Route path="/addReglementRecu" element={<AddReglementRecu isSidebarOpen={isSidebarOpen} />} />
        <Route path="/detailsReglementRecu/:id" element={<DetailsReglementRecu isSidebarOpen={isSidebarOpen} />} />
        <Route path="/updateReglementRecu/:id" element={<UpdateReglementRecu isSidebarOpen={isSidebarOpen} />} />
        <Route path="/versements" element={<Versements isSidebarOpen={isSidebarOpen} />} />
        <Route path="/addVersement" element={<AddVersement isSidebarOpen={isSidebarOpen} />} />
        <Route path="/detailsVersement/:id" element={<DetailsVersement isSidebarOpen={isSidebarOpen} />} />
        <Route path="/updateVersement/:id" element={<UpdateVersement isSidebarOpen={isSidebarOpen} />} />
        <Route path="/pointage" element={<Pointage isSidebarOpen={isSidebarOpen} />} />
        <Route path="/addPointage" element={<AddPointage isSidebarOpen={isSidebarOpen} />} />
        <Route path="/documents_comptabilite" element={<DocumentComptabilite isSidebarOpen={isSidebarOpen} />} />
        <Route path="/addDocCompta" element={<AddDocCompta isSidebarOpen={isSidebarOpen} />} />
        <Route path="/updateDocCompta/:id" element={<UpdateDocCompta isSidebarOpen={isSidebarOpen} />} />
        <Route path="/configurations" element={<Configurations isSidebarOpen={isSidebarOpen} />} />
        <Route path="/documents_direction"  element={<DocumentDirection  isSidebarOpen={isSidebarOpen} />} />
        <Route path="/addDocDirection" />
      </Routes>
    </div>
  );
};

export default ProtectedRoutes;