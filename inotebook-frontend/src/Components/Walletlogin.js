import { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";

const WalletLogin = ({ onLogin }) => {
  const [walletAddress, setWalletAddress] = useState("");

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      // Backend call to login/register user
      const res = await axios.post("https://notemore-dashboard.onrender.com/api/auth/wallet-login", {
        walletAddress: address
      });

      if (res.data.success) {
        localStorage.setItem("token", res.data.authToken);
        setWalletAddress(address);
        onLogin(address); // send to parent/context if needed
      } else {
        alert("Login failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <button onClick={connectWallet}>Login with MetaMask</button>
      {walletAddress && <p>Logged in as: {walletAddress}</p>}
    </div>
  );
};

export default WalletLogin;
