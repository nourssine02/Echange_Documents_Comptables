import React, { useContext } from "react";
import { UserContext } from "../Connexion/UserProvider";
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBTypography, MDBIcon } from 'mdb-react-ui-kit';


const Profile = ({ isSidebarOpen }) => {
  const { user } = useContext(UserContext);

 
  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? "shifted" : ""}`}>
      
      
          </div>
       </div>
  );
};

export default Profile;
