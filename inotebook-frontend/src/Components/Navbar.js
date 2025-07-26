import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from "./Notemoire_logo.png";
import './Navbar.css';

const Navbar = ({ setIsAuthenticated }) => {
const location = useLocation();
const navigate = useNavigate();

const handleLogout = () => {
localStorage.removeItem('token');
setIsAuthenticated(false);
navigate("/login");
};

return (
<nav className="sidebar">
<div className="sidebar-content">
<div className="sidebar-top">
<img src={logo} className="sidebar__logo" alt="Notemoire Logo" />

      <ul className="sidebar-nav">
        <li>
          <Link className={`nav-link ${location.pathname === "/" ? "active" : ""}`} to="/">Home</Link>
        </li>
        <li>
          <Link className={`nav-link ${location.pathname === "http://localhost:3001/" ? "active" : ""}`} to="http://localhost:3001/">NoteMoire</Link>
        </li>
        <li>
          <Link className={`nav-link ${location.pathname === "/ai" ? "active" : ""}`} to="/ai">AI Enhancements</Link>
        </li>
        {!localStorage.getItem('token') && (
          <>
            <li>
              <Link className={`nav-link ${location.pathname === "/login" ? "active" : ""}`} to="/login">Login</Link>
            </li>
            <li>
              <Link className={`nav-link ${location.pathname === "/signup" ? "active" : ""}`} to="/signup">Sign up</Link>
            </li>
          </>
        )}
      </ul>
    </div>

    {localStorage.getItem('token') && (
      <div className="logout-container">
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    )}
  </div>
</nav>
);
};

export default Navbar;

