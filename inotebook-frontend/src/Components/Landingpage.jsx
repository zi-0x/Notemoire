import React from "react";
import { useNavigate } from "react-router-dom";
import "./Landingpage.css"; // Importing the CSS file

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="card">
        <h1 className="title">
          Welcome to <span className="highlight">iNotebook</span>
        </h1>
        <p className="subtitle">
          Effortless. Elegant. Encrypted. <br />
          Your notes, always within reach.
        </p>
        <div className="button-group">
          <button className="btn login-btn" onClick={() => navigate("/login")}>
            🚪 Login
          </button>
          <button className="btn signup-btn" onClick={() => navigate("/signup")}>
            ✍️ Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}