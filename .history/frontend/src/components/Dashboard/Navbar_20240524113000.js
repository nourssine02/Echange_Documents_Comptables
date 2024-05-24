import React, { useContext, useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../Connexion/UserProvider";
import axios from "axios";
import notificationSound from "../Notifications/notification.mp3";
import "./Navbar.css";

const Navbar = () => {
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
    useState(false);
  const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const { user } = useContext(UserContext);

  const prevNotificationsRef = useRef([]);
  const audioRef = useRef(new Audio(notificationSound));
  const hasInteracted = useRef(false);

  const toggleNotificationDropdown = () => {
    setIsNotificationDropdownOpen(!isNotificationDropdownOpen);
    setIsSettingsDropdownOpen(false);
    if (!isNotificationDropdownOpen) {
      markNotificationsAsRead();
    }
  };

  const toggleSettingsDropdown = () => {
    setIsSettingsDropdownOpen(!isSettingsDropdownOpen);
    setIsNotificationDropdownOpen(false);
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      if (user) {
        try {
          const res = await axios.get(
            `http://localhost:5000/notifications/${user.id}`
          );
          const newNotifications = res.data;
          setNotifications(newNotifications);
          setUnreadNotifications(
            newNotifications.filter((notification) => !notification.read)
          );

          // Check for new notifications
          if (prevNotificationsRef.current.length < newNotifications.length) {
            if (hasInteracted.current) {
              playNotificationSound();
            } else {
              const playSound = () => {
                playNotificationSound();
                window.removeEventListener("click", playSound);
              };
              window.addEventListener("click", playSound);
            }
          }
          prevNotificationsRef.current = newNotifications;
        } catch (err) {
          console.error("Error fetching notifications:", err);
        }
      }
    };

    fetchNotifications();
  }, [user]);

  const playNotificationSound = () => {
    if (unreadNotifications.length > 0) {
      audioRef.current.play();
    }
  };

  useEffect(() => {
    const handleUserInteraction = () => {
      hasInteracted.current = true;
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);
    };

    window.addEventListener("click", handleUserInteraction);
    window.addEventListener("keydown", handleUserInteraction);

    return () => {
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);
    };
  }, []);

  const markNotificationsAsRead = async () => {
    try {
      await axios.post(`http://localhost:5000/notifications/markAsRead`, {
        userId: user.id,
      });
      setUnreadNotifications([]);
    } catch (err) {
      console.error("Error marking notifications as read:", err);
    }
  };

  const removeNotification = async (notificationId) => {
    try {
      await axios.delete(
        `http://localhost:5000/notifications/${notificationId}`
      );
      setNotifications(notifications.filter((n) => n.id !== notificationId));
      setUnreadNotifications(
        unreadNotifications.filter((n) => n.id !== notificationId)
      );
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
      <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
        <Link className="navbar-brand brand-logo mr-5" to="#">
          <img
            src="assets/images/logo-compta.png"
            className="ml-4"
            alt="logo"
          />
        </Link>
      </div>
      <div className="navbar-menu-wrapper d-flex align-items-center justify-content-end">
        <button
          className="navbar-toggler navbar-toggler align-self-center"
          type="button"
          data-toggle="minimize"
        >
          <span className="icon-menu"></span>
        </button>
        <ul className="navbar-nav mr-lg-2">
          <li className="nav-item nav-search d-none d-lg-block">
            <div className="input-group">
              <div
                className="input-group-prepend hover-cursor"
                id="navbar-search-icon"
              >
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
            <button
              className="nav-link count-indicator dropdown-toggle btn btn-default"
              id="notificationDropdown"
              onClick={toggleNotificationDropdown}
            >
              <div className="notification-bell">
                <i className="icon-bell mx-0"></i>
                {unreadNotifications.length > 0 && (
                  <span className="notification-count">
                    {unreadNotifications.length}
                  </span>
                )}
              </div>
            </button>
            <div
              className={`dropdown-menu dropdown-menu-right navbar-dropdown ${
                isNotificationDropdownOpen ? "show" : ""
              }`}
              aria-labelledby="notificationDropdown"
            >
              <h6 className="dropdown-header">
                Notifications ({unreadNotifications.length})
              </h6>
              {notifications.length === 0 ? (
                <p className="dropdown-item">Aucune notification</p>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="dropdown-item d-flex justify-content-between align-items-center"
                  >
                    <span>{notification.message}</span>&nbsp;&nbsp;&nbsp;
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removeNotification(notification.id)}
                    >
                      X
                    </button>
                  </div>
                ))
              )}
            </div>
          </li>
          <li className="nav-item nav-profile dropdown show">
            <Link
              to="/profile"
              className="nav-link dropdown-toggle"
              id="profileDropdown"
            >
              <img src="assets/images/faces/face.jpg" alt="profile" />
            </Link>
            {user.identite && (
              <ul className="navbar-nav navbar-nav-right">
                <li className="nav-item">
                  <strong className="nav-link">{user.identite}</strong>
                </li>
              </ul>
            )}
          </li>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <li
            className={`nav-item nav-settings d-none d-lg-flex dropdown ${
              isSettingsDropdownOpen ? "show" : ""
            }`}
          >
            <button
              className="nav-link btn btn-default"
              onClick={toggleSettingsDropdown}
            >
              <i className="bi bi-three-dots-vertical"></i>
            </button>

            <div
              className={`dropdown-menu dropdown-menu-right navbar-dropdown ${
                isSettingsDropdownOpen ? "show" : ""
              }`}
            >
              {user.role === "comptable" && (
                <Link to="/configurations" className="dropdown-item">
                  <i className="ti-settings text-primary"></i>
                  Configurations
                </Link>
              )}
              <Link onClick={logout} className="dropdown-item">
                <i className="ti-power-off text-primary"></i>
                Déconnexion
              </Link>
            </div>
          </li>
        </ul>
        <button
          className="navbar-toggler navbar-toggler-right d-lg-none align-self-center"
          type="button"
          data-toggle="offcanvas"
        >
          <span className="icon-menu"></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
