// src/front/js/component/navbar.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Login } from "./login"; // Import the Login component

export const Navbar = ({ isAuthenticated, onLogout, onLoginSuccess }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    onLogout(); // Update the authentication state
    navigate("/"); // Redirect to home page
  };

  return (
    <nav className="navbar navbar-light bg-light">
      <div className="container">
        <Link to="/">
          <span className="navbar-brand mb-0 h1">React Boilerplate</span>
        </Link>
        <div className="ml-auto">
          <Link to="/private">
            <button className="btn btn-primary">Private</button>
          </Link>
          {isAuthenticated ? (
            <button className="btn btn-secondary ml-2" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <div
              className="dropdown"
              style={{ display: "inline-block", marginLeft: "10px" }}
            >
              <button
                className="btn btn-secondary dropdown-toggle"
                type="button"
                id="dropdownMenuButton"
                aria-expanded={showDropdown ? "true" : "false"}
                style={{ width: "200px" }}
                onClick={() => setShowDropdown(!showDropdown)}
              >
                Login
              </button>
              <div
                className={`dropdown-menu ${showDropdown ? "show" : ""}`}
                aria-labelledby="dropdownMenuButton"
                style={{ padding: "20px", width: "300px" }}
              >
                <Login onLoginSuccess={onLoginSuccess} />
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
