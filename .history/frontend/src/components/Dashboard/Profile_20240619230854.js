import React, { useContext } from "react";
import { UserContext } from "../Connexion/UserProvider";
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBTypography, MDBIcon } from 'mdb-react-ui-kit';


const Profile = ({ isSidebarOpen }) => {
  const { user } = useContext(UserContext);

 
  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? "shifted" : ""}`}>
        <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            {/* <div className="card">
              <div className="card-body">
                <h2 className="font-medium text-center mb-5">
                    Mon Profile
                </h2>
                <ul className="list-ticked">
                  <li>
                    <strong>Identite:</strong> {user.identite}
                  </li>
                  <li>
                    <strong>Position:</strong> {user.position}
                  </li>
                  <li>
                    <strong>Email:</strong> {user.email}
                  </li>
                </ul>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
