import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

export default function NavBar() {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">CyberBot</div>
      <div className="navbar-links">
        <Link className="nav-link" to="/">Home</Link>
        <Link className="nav-link" to="/register">Register</Link>
        <Link className="nav-link" to="/login">Login</Link>
        <Link className="nav-link" to="/dashboard">Dashboard</Link>
        <Link className="nav-link" to="/chat">Chat</Link>
      </div>
      <div className="navbar-user" onClick={toggleDropdown}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="user-icon"
          viewBox="0 0 24 24"
          fill="currentColor"
          width="32px"
          height="32px"
        >
          <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z"/>
        </svg>
        {dropdownVisible && (
          <div className="dropdown-menu">
            <ul>
              <li><Link to="/account">Account Settings</Link></li>
              <li><Link to="/billing">Billing</Link></li>
              <li><Link to="/subscription">Subscription</Link></li>
              <li><Link to="/logout">Log Out</Link></li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
