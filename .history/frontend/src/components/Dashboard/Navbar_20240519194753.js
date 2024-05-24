import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../Connexion/UserProvider";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  //const [error, setError] = useState("");
  const { user } = useContext(UserContext);


  if (!user) {
    return null; // Ou afficher un message de chargement
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const token = localStorage.getItem("token");
  //       if (!token) {
  //         setError("Utilisateur non authentifié");
  //         return;
  //       }

  //       const response = await axios.get("http://localhost:5000/home", {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });

  //       setUserData(response.data.user);
  //     } catch (error) {
  //       setError("Erreur lors de la récupération des données");
  //     }
  //   };

  //   fetchUserData();
  // }, []);


  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <nav className="navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
      <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
        <Link className="navbar-brand brand-logo mr-5" to="#">
          <img src="assets/images/logo-compta.png" className="ml-4" alt="logo" />
        </Link>
      </div>
      <div className="navbar-menu-wrapper d-flex align-items-center justify-content-end">
        <button className="navbar-toggler navbar-toggler align-self-center" type="button" data-toggle="minimize">
          <span className="icon-menu"></span>
        </button>
        <ul className="navbar-nav mr-lg-2">
          <li className="nav-item nav-search d-none d-lg-block">
            <div className="input-group">
              <div className="input-group-prepend hover-cursor" id="navbar-search-icon">
                <span className="input-group-text" id="search">
                  <i className="icon-search"></i>
                </span>
              </div>
              <input
                type="text"
                className="form-control"
                id="navbar-search-input"
                placeholder="Search now"
                aria-label="search"
                aria-describedby="search"
              />
            </div>
          </li>
        </ul>
        <ul className="navbar-nav navbar-nav-right">
          <li className="nav-item dropdown">
            {/* eslint-disable-next-line */}
            <a className="nav-link count-indicator dropdown-toggle" id="notificationDropdown" data-toggle="dropdown">
              <i className="icon-bell mx-0"></i>
              <span className="count"></span>
            </a>
          </li>
          <li className="nav-item nav-profile dropdown show">
            <a href="/profile" className="nav-link dropdown-toggle" data-toggle="dropdown" id="profileDropdown" aria-expanded="true">
              <img src="assets/images/faces/face.jpg" alt="profile" />
            </a>

            {user.identite && (
              <ul className="navbar-nav navbar-nav-right">
                <li className="nav-item">
                  <strong className="nav-link">{user.identite}</strong>
                </li>
              </ul>
            )}
          </li>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <li className={`nav-item nav-settings d-none d-lg-flex dropdown ${isDropdownOpen ? "show" : ""}`}>
            {/* eslint-disable-next-line */}
            <a className="nav-link" onClick={toggleDropdown}>
              <i className="bi bi-three-dots-vertical"></i>
            </a>

            <div className={`dropdown-menu dropdown-menu-right navbar-dropdown ${isDropdownOpen ? "show" : ""}`}>
              <Link to="/settings" className="dropdown-item">
                <i className="ti-settings text-primary"></i>
                Settings
              </Link>
              <Link onClick={logout} className="dropdown-item">
                <i className="ti-power-off text-primary"></i>
                Logout
              </Link>
            </div>
          </li>
        </ul>
        <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" data-toggle="offcanvas">
          <span className="icon-menu"></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
