import React from "react";

const Navbar = () => {
  return (
    
    <nav className="navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
      <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
        <a className="navbar-brand brand-logo mr-5" href="/">
          <img src="assets/images/logo-compta.png" className="ml-4 " alt="logo" />
        </a>
      </div>
      <div className="navbar-menu-wrapper d-flex align-items-center justify-content-end">
        <button
          className="navbar-toggler navbar-toggler align-self-center"
          type="button"
          data-toggle="minimize" >
          <span className="icon-menu"></span>
        </button>
        <ul className="navbar-nav mr-lg-2">
          <li className="nav-item nav-search d-none d-lg-block">
            <div className="input-group">
              <div
                className="input-group-prepend hover-cursor"
                id="navbar-search-icon"  >
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
                aria-describedby="search" />
            </div>
          </li>
        </ul>
        <ul className="navbar-nav navbar-nav-right">
          <li className="nav-item dropdown">
            <a
              href="/"
              className="nav-link count-indicator dropdown-toggle"
              id="notificationDropdown"
              data-toggle="dropdown">
              <i className="icon-bell mx-0"></i>
              <span className="count"></span>
            </a>
            {/* Dropdown content */}
          </li>
          <li className="nav-item nav-profile dropdown">
            <a
              className="nav-link dropdown-toggle"
              href="/"
              data-toggle="dropdown"
              id="profileDropdown">
              <img src="assets/images/faces/face.jpg" alt="profile" />
            </a>
            {/* Dropdown content */}
          </li>
          <li className="nav-item nav-settings d-none d-lg-flex">
            <a className="nav-link" href="/">
              <i className="icon-ellipsis"></i>
            </a>
          </li>
        </ul>
        <button
          className="navbar-toggler navbar-toggler-right d-lg-none align-self-center"
          type="button"
          data-toggle="offcanvas">
          <span className="icon-menu"></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
