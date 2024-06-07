import React, { useContext, useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../Connexion/UserProvider";
import axios from "axios";
import notificationSound from "../Notifications/notification.mp3";
import "./Navbar.css";
import Sidebar from "./Sidebar";

const Navbar = () => {
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState([]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  const playNotificationSound = useCallback(() => {
    if (unreadNotifications.length > 0) {
      audioRef.current.play();
    }
  }, [unreadNotifications.length]);

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
  }, [user, playNotificationSound]);

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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarItemClick = () => {
    // Ne rien faire ici pour garder le Sidebar ouvert
  };

  return (
    <>
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
          <button className="navbar-toggler navbar-toggler align-self-center" type="button" onClick={toggleSidebar}>
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
              <a
                className="nav-link count-indicator dropdown-toggle"
                id="notificationDropdown"
                href="#"
                onClick={toggleNotificationDropdown}
              >
                <i className="icon-bell mx-0"></i>
                {unreadNotifications.length > 0 && (
                  <span className="count"></span>
                )}
              </a>
              <div
                className={`dropdown-menu dropdown-menu-right navbar-dropdown ${
                  isNotificationDropdownOpen ? "show" : ""
                }`}
                aria-labelledby="notificationDropdown"
              >
                <h6 className="font-weight-normal dropdown-header">
                  Notifications
                </h6>
                {notifications.length === 0 ? (
                  <p className="text-center">No notifications</p>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`dropdown-item ${
                        notification.read ? "" : "unread"
                      }`}
                    >
                      <div className="notification-item">
                        <p className="mb-1">{notification.message}</p>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() =>
                            removeNotification(notification.id)
                          }
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </li>
            <li className="nav-item nav-profile dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="profileDropdown"
                onClick={toggleSettingsDropdown}
              >
                <img src="assets/images/faces/face28.jpg" alt="profile" />
              </a>
              <div
                className={`dropdown-menu dropdown-menu-right navbar-dropdown ${
                  isSettingsDropdownOpen ? "show" : ""
                }`}
                aria-labelledby="profileDropdown"
              >
                <a className="dropdown-item" href="#">
                  <i className="ti-settings text-primary"></i>
                  Settings
                </a>
                <a className="dropdown-item" href="#" onClick={logout}>
                  <i className="ti-power-off text-primary"></i>
                  Logout
                </a>
              </div>
            </li>
          </ul>
        </div>
      </nav>
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        handleSidebarItemClick={handleSidebarItemClick}
      />
      <div className={`main-panel ${isSidebarOpen ? 'shifted' : ''}`}>
        <div className="content-wrapper">
          {/* Contenu de votre page */}
        </div>
      </div>
    </>
  );
};

export default Navbar;
