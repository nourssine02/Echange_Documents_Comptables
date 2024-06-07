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
          const res = await axios.get(`http://localhost:5000/notifications/${user.id}`);
          const newNotifications = res.data;
          setNotifications(newNotifications);
          setUnreadNotifications(newNotifications.filter((notification) => !notification.read));

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
      await axios.post(`http://localhost:5000/notifications/markAsRead`, { userId: user.id });
      setUnreadNotifications([]);
    } catch (err) {
      console.error("Error marking notifications as read:", err);
    }
  };

  const removeNotification = async (notificationId) => {
    try {
      await axios.delete(`http://localhost:5000/notifications/${notificationId}`);
      setNotifications(notifications.filter((n) => n.id !== notificationId));
      setUnreadNotifications(unreadNotifications.filter((n) => n.id !== notificationId));
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

  return (
    <>
      <nav className="navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
        <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
          <Link className="navbar-brand brand-logo mr-5" to="#">
            <img src="assets/images/logo-compta.png" className="ml-4" alt="logo" />
          </Link>
        </div>
        <div className="navbar-menu-wrapper d-flex align-items-center justify-content-end">
          <button className="navbar-toggler navbar-toggler align-self-center" type="button" onClick={toggleSidebar}>
            <span className="icon-menu"></span>
          </button>
          <ul className="navbar-nav navbar-nav-right">
            <li className={`nav-item dropdown ${isNotificationDropdownOpen ? "show" : ""}`}>
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
                className={`dropdown-menu dropdown-menu-right navbar-dropdown ${isNotificationDropdownOpen ? "show" : ""}`}
                aria-labelledby="notificationDropdown"
              >
                <h6 className="p-3 mb-0">Notifications</h6>
                <div className="dropdown-divider"></div>
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <a key={notification.id} className="dropdown-item preview-item">
                      <div className="preview-thumbnail">
                        <div className="preview-icon bg-success">
                          <i className="ti-info-alt mx-0"></i>
                        </div>
                      </div>
                      <div className="preview-item-content d-flex align-items-start flex-column justify-content-center">
                        <h6 className="preview-subject font-weight-normal mb-1">
                          {notification.message}
                        </h6>
                        <p className="text-gray ellipsis mb-0">
                          {new Date(notification.date).toLocaleString()}
                        </p>
                      </div>
                      <div className="ml-auto p-2" onClick={() => removeNotification(notification.id)}>
                        <i className="bi bi-trash"></i>
                      </div>
                    </a>
                  ))
                ) : (
                  <p className="p-3 mb-0 text-center">No notifications</p>
                )}
              </div>
            </li>
            <li className={`nav-item dropdown ${isSettingsDropdownOpen ? "show" : ""}`}>
              <a
                className="nav-link"
                id="settingsDropdown"
                href="#"
                onClick={toggleSettingsDropdown}
              >
                <i className="icon-settings mx-0"></i>
              </a>
              <div
                className={`dropdown-menu dropdown-menu-right navbar-dropdown ${isSettingsDropdownOpen ? "show" : ""}`}
                aria-labelledby="settingsDropdown"
              >
                <h6 className="p-3 mb-0">Settings</h6>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item" onClick={logout}>
                  <i className="dropdown-item-icon icon-power text-primary"></i>
                  Sign Out
                </a>
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
      <Sidebar isSidebarOpen={isSidebarOpen} />
    </>
  );
};

export default Navbar;
