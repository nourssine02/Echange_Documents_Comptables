import React, { useContext } from "react";
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

const ProtectedRoutes = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { user } = useContext(UserContext);

  if (!user) {
    return <Navigate to="/" />;
  }

  const handleSidebarItemClick = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  return (
    <div className="container-fluid page-body-wrapper">
      <Navbar />
      <Sidebar />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/entreprises" element={<Entreprises />} />
        <Route path="/addEntreprise" element={<AddEntreprise />} />
        <Route path="/updateEntreprise/:id" element={<UpdateEntreprise />} />
        <Route path="/detailsEntreprise/:id" element={<DetailsEntreprise />} />
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
        <Route path="/detailsReglement/:id" element={<DetailsReglement />} />
        <Route path="/updateReglement/:id" element={<UpdateReglement />} />
        <Route path="/commandes" element={<Commandes />} />
        <Route path="/addCommande" element={<AddCommande />} />
        <Route path="/detailsCommande/:id" element={<DetailsCommande />} />
        <Route path="/updateCommande/:id" element={<UpdateCommande />} />
        <Route path="/livraisons" element={<Livraisons />} />
        <Route path="/addLivraison" element={<AddLivraison />} />
        <Route path="/updateLivraison/:id" element={<UpdateLivraison />} />
        <Route path="/detailsLivraison/:id" element={<DetailsLivraison />} />
        <Route path="/facturations" element={<Facturations />} />
        <Route path="/addFacture" element={<AddFacture />} />
        <Route path="/detailsFacture/:id" element={<DetailsFacture />} />
        <Route path="/updateFacture/:id" element={<UpdateFacture />} />
        <Route path="/reglements_recus" element={<ReglementsRecus />} />
        <Route path="/addReglementRecu" element={<AddReglementRecu />} />
        <Route
          path="/detailsReglementRecu/:id"
          element={<DetailsReglementRecu />}
        />
        <Route
          path="/updateReglementRecu/:id"
          element={<UpdateReglementRecu />}
        />
        <Route path="/versements" element={<Versements />} />
        <Route path="/addVersement" element={<AddVersement />} />
        <Route path="/detailsVersement/:id" element={<DetailsVersement />} />
        <Route path="/updateVersement/:id" element={<UpdateVersement />} />
        <Route path="/pointage" element={<Pointage />} />
        <Route path="/addPointage" element={<AddPointage />} />
        <Route
          path="/documents_comptabilite"
          element={<DocumentComptabilite />}
        />
        <Route path="/addDocCompta" element={<AddDocCompta />} />
        <Route path="/updateDocCompta/:id" element={<UpdateDocCompta />} />
        <Route path="/configurations" element={<Configurations />} />
      </Routes>
    </div>
  );
};

export default ProtectedRoutes;
