import React from "react";
import WalletLogin from "./Walletlogin";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Import the CSS file

const Login = ({ showAlert, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleWalletLogin = (walletAddress) => {
    localStorage.setItem("walletAddress", walletAddress);
    setIsAuthenticated(true);
    showAlert("Wallet login successful", "success");
    navigate("/");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login with your Wallet</h2>
        <p className="login-subtitle">Connect your wallet to access your notes.</p>
        <WalletLogin onLogin={handleWalletLogin} />
      </div>
    </div>
  );
};

export default Login;
