import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../Connexion/UserProvider";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBTypography,
  MDBBtn,
} from "mdb-react-ui-kit";
import axios from "axios";

const Profile = ({ isSidebarOpen }) => {
  const { user, setUser } = useContext(UserContext);

  const [formData, setFormData] = useState({
    code_entreprise: user?.code_entreprise || "",
    code_user: user?.code_user || "",
    identite: user?.identite || "",
    position: user?.position || "",
    tel: user?.tel || "",
    email: user?.email || "",
    role: user?.role || "",
    profile_image: user?.profile_image || "",
  });

  const [imagePreview, setImagePreview] = useState(user?.profile_image || "");
  const [successMessage, setSuccessMessage] = useState(""); // Pour afficher un message de succès
  const [errorMessage, setErrorMessage] = useState(""); // Pour afficher un message d'erreur

  useEffect(() => {
    if (user) {
      setFormData({
        code_entreprise: user.code_entreprise || "",
        code_user: user.code_user || "",
        identite: user.identite || "",
        position: user.position || "",
        tel: user.tel || "",
        email: user.email || "",
        role: user.role || "",
        profile_image: user.profile_image || "",
      });
      setImagePreview(user.profile_image || "");
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        setFormData({ ...formData, profile_image: base64Image });
        setImagePreview(base64Image);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .put(`http://localhost:5000/users/${user.id}`, formData)
      .then((res) => {
        if (res.data) {
          setUser(res.data); // Met à jour le contexte utilisateur
          setFormData(res.data); // Met à jour le formulaire avec les nouvelles données
          setImagePreview(res.data.profile_image); // Met à jour l'aperçu de l'image
          setSuccessMessage("Profile updated successfully"); // Message de succès
          setErrorMessage(""); // Efface le message d'erreur

          // Efface le message après 5 secondes
          setTimeout(() => setSuccessMessage(""), 5000);
        }
      })
      .catch((err) => {
        console.error("Error updating profile:", err);
        setErrorMessage("Error updating profile");
        setSuccessMessage(""); // Efface le message de succès

        // Efface le message d'erreur après 5 secondes
        setTimeout(() => setErrorMessage(""), 5000);
      });
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? "shifted" : ""}`}>
        <section className="vh-100">
          <MDBContainer className="py-4 h-150">
            <MDBRow className="justify-content-center align-items-center h-150">
              <MDBCol lg="9" className="mb-4 mb-lg-0">
                <MDBCard className="mb-3" style={{ borderRadius: ".5rem" }}>
                  <MDBRow className="g-0">
                    <MDBCol
                      md="4"
                      className="text-center text-white"
                      style={{
                        borderTopLeftRadius: ".5rem",
                        borderBottomLeftRadius: ".5rem",
                        background:
                          "linear-gradient(to right bottom, rgba(185, 192 ,207), rgba(194, 246, 200))",
                      }}
                    >
                      <MDBCardImage
                        src={imagePreview ? imagePreview : ""}
                        alt="Avatar"
                        className="my-5"
                        style={{ width: "100px", borderRadius: "50%" }}
                        fluid
                      />
                      <input
                        type="file"
                        id="imageUpload"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: "none" }}
                      />
                      <i
                        className="fas fa-camera position-absolute"
                        style={{
                          bottom: "310px",
                          right: "50%",
                          transform: "translateX(50%)",
                          cursor: "pointer",
                          fontSize: "20px",
                          color: "black",
                          background: "white",
                          padding: "5px",
                          borderRadius: "50%",
                        }}
                        onClick={() =>
                          document.getElementById("imageUpload").click()
                        }
                      ></i>
                      <MDBTypography tag="h5" color="black">
                        {formData.identite}
                      </MDBTypography>
                    </MDBCol>
                    <MDBCol md="8">
                      <MDBCardBody className="p-4">
                        <form onSubmit={handleSubmit}>
                          <MDBTypography tag="h2">Mes Informations</MDBTypography>
                          <hr className="mt-0 mb-4" />
                          {successMessage && (
                            <div className="alert alert-success">
                              {successMessage}
                            </div>
                          )}
                          {errorMessage && (
                            <div className="alert alert-danger">
                              {errorMessage}
                            </div>
                          )}
                          <MDBRow className="pt-1">
                            <MDBCol size="6" className="mb-3">
                              <label htmlFor="code_user">Code Utilisateur :</label>
                              <input
                                id="code_user"
                                name="code_user"
                                value={formData.code_user}
                                onChange={handleChange}
                                className="form-control"
                                style={{ border: "none" }}
                              />
                            </MDBCol>
                            <MDBCol size="6" className="mb-3">
                              <label htmlFor="code_entreprise">
                                Code Entreprise :
                              </label>
                              <input
                                id="code_entreprise"
                                name="code_entreprise"
                                value={formData.code_entreprise}
                                onChange={handleChange}
                                className="form-control"
                                style={{ border: "none" }}
                              />
                            </MDBCol>
                          </MDBRow>
                          {/* Autres champs... */}
                          <MDBBtn
                            type="submit"
                            className="btn btn-primary"
                            style={{
                              minWidth: "150px",
                              height: "45px",
                              padding: "10px 20px",
                            }}
                          >
                            Save Changes
                          </MDBBtn>
                        </form>
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
