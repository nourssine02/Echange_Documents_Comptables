import React, { useContext, useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../Connexion/UserProvider";
import axios from "axios";
import notificationSound from "../Notifications/notification.mp3";
import "./Navbar.css";
import Sidebar from "./Sidebar";
import Home from "../Home/Home"; // Ensure Home component is imported

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

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <nav className="navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
        <div className="navbar-brand-wrapper d-flex justify-content-center">
          <div className="navbar-brand-inner-wrapper d-flex justify-content-between align-items-center w-100">
            <button className="navbar-toggler navbar-toggler align-self-center" type="button" onClick={handleSidebarToggle}>
              <span className="bi bi-list"></span>
            </button>
          </div>
        </div>
        <div className="navbar-menu-wrapper d-flex align-items-center justify-content-end">
          <ul className="navbar-nav mr-lg-2">
            <li className="nav-item nav-profile">
              <a className="nav-link" href="#">{user.name}</a>
            </li>
            <li className={`nav-item dropdown ${isNotificationDropdownOpen ? 'show' : ''}`}>
              <button
                type="button"
                className="nav-link btn btn-default"
                onClick={toggleNotificationDropdown}
              >
                <i className="bi bi-bell"></i>
                {unreadNotifications.length > 0 && (
                  <span className="notification-count">{unreadNotifications.length}</span>
                )}
              </button>
              <div className={`dropdown-menu dropdown-menu-right navbar-dropdown ${isNotificationDropdownOpen ? 'show' : ''}`}>
                <h6 className="dropdown-header">Notifications</h6>
                {notifications.length === 0 && (
                  <p className="dropdown-item">No notifications</p>
                )}
                {notifications.map((notification) => (
                  <div key={notification.id} className="dropdown-item">
                    <p>{notification.message}</p>
                    <button onClick={() => removeNotification(notification.id)}>Remove</button>
                  </div>
                ))}
              </div>
            </li>
            <li className={`nav-item dropdown ${isSettingsDropdownOpen ? 'show' : ''}`}>
              <button
                type="button"
                className="nav-link btn btn-default"
                onClick={toggleSettingsDropdown}
              >
                <i className="bi bi-gear"></i>
              </button>
              <div className={`dropdown-menu dropdown-menu-right navbar-dropdown ${isSettingsDropdownOpen ? 'show' : ''}`}>
                <Link className="dropdown-item" to="/profile">
                  Profil
                </Link>
                <button className="dropdown-item" onClick={logout}>
                  Déconnexion
                </button>
              </div>
            </li>
          </ul>
        </div>
      </nav>
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <Home isSidebarOpen={isSidebarOpen} />
    </>
  );
};

export default Navbar;
