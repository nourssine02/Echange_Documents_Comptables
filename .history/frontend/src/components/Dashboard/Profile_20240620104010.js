import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../Connexion/UserProvider";
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBTypography, MDBIcon } from 'mdb-react-ui-kit';
import axios from "axios";


const Profile = ({ isSidebarOpen }) => {
  const { user } = useContext(UserContext);
  const { id } = useParams();


  const [profile, setProfile] = useState({
    code_entreprise: "",
    code_user: "",
    identite: "",
    position: "",
    tel: "",
    email: "",
    mot_de_passe: "",
  });



  useEffect(() => {
    axios
      .get("http://localhost:5000/entreprises/" + id)
      .then((res) => {
        const data = res.data[0];
        setProfile({
          code_entreprise: data.code_entreprise,
          code_user: data.code

        });
      })
      .catch((err) => console.log(err));
  }, [id]);


  
 
  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? "shifted" : ""}`}>
      
      <section className="vh-100">
      <MDBContainer className="py-4 h-150">
        <MDBRow className="justify-content-center align-items-center h-150">
          <MDBCol lg="9" className="mb-4 mb-lg-0">
            <MDBCard className="mb-3" style={{ borderRadius: '.5rem' }}>
              <MDBRow className="g-0">
                <MDBCol md="4" className="text-center text-white"
                  style={{ borderTopLeftRadius: '.5rem', borderBottomLeftRadius: '.5rem' , 
                    background: "linear-gradient(to right bottom, rgba(246, 211, 101, 1), rgba(253, 160, 133, 1))"
                   }}>
                  <MDBCardImage src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                    alt="Avatar" className="my-5" style={{ width: '80px' }} fluid />
                  <MDBTypography tag="h5">{profile.name}</MDBTypography>
                  <MDBCardText>{profile.position}</MDBCardText>
                  <MDBIcon far icon="edit mb-5" />
                </MDBCol>
                <MDBCol md="8">
                  <MDBCardBody className="p-4">
                    <MDBTypography tag="h6">Information</MDBTypography>
                    <hr className="mt-0 mb-4" />
                    <MDBRow className="pt-1">
                      <MDBCol size="6" className="mb-3">
                        <MDBTypography tag="h6">Email</MDBTypography>
                        <MDBCardText className="text-muted">{profile.email}</MDBCardText>
                      </MDBCol>
                      <MDBCol size="6" className="mb-3">
                        <MDBTypography tag="h6">Phone</MDBTypography>
                        <MDBCardText className="text-muted">{profile.phone}</MDBCardText>
                      </MDBCol>
                    </MDBRow>

                   
                  </MDBCardBody>
                </MDBCol>
              </MDBRow>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
        </div>
       </div>
  );
};

export default Profile;
