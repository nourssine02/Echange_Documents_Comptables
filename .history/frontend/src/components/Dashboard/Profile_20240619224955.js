import React, { useContext } from "react";
import { UserContext } from "../Connexion/UserProvider";

const Profile = ({ isSidebarOpen }) => {
  const { user } = useContext(UserContext);
  //const { id } = useParams();

  // useEffect(() => {
  //     axios
  //       .get("http://localhost:5000/entreprises/" + id)
  //       .then((res) => {
  //         const data = res.data[0];
  //         setEntreprise({
  //           code_entreprise: data.code_entreprise,
  //           date_creation: data.date_creation,
  //           identite: data.identite,
  //           MF_CIN: data["MF/CIN"],
  //           responsable: data.responsable,
  //           cnss: data.cnss,
  //           tel: data.tel,
  //           email: data.email,
  //           adresse: data.adresse,
  //         });
  //       })
  //       .catch((err) => console.log(err));
  //   }, [id]);

  return (
    <div className="main-panel">
      <div className={`content-wrapper ${isSidebarOpen ? "shifted" : ""}`}>
        <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h2 className="font-medium text-center mb-5">
                    Mon Profile
                </h2>
                <div className="list-ticked">
                  <p>
                    <strong>Name:</strong> {user.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
