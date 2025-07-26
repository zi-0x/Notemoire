import logo from './Notemoire_welcome.png';
import Sidebar from "./Sidebar";
import Feed from "./Feed";
import Widgets from "./Widgets";
import Profile from "./Profile";
import "./App.css";
import { useState, useEffect } from "react";
import * as React from 'react';
import { useTheme} from '@mui/material/styles';
import Avatar from 'react-avatar';

<Avatar name="Sociva User" size="100" round={true} />

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

function App() {

  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);
  const [currentAccount, setCurrentAccount] = useState('');
  const [correctNetwork, setCorrectNetwork] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentView, setCurrentView] = useState('home'); // 'home' or 'profile'

    // Calls Metamask to connect wallet on clicking Connect Wallet button
  const connectWallet = async () => {
    try {
      const { ethereum } = window

      if (!ethereum) {
        console.log('Metamask not detected')
        return;
      }
      let chainId = await ethereum.request({ method: 'eth_chainId'})
      console.log('Connected to chain:' + chainId);

      const sepoliaChainId = '0xaa36a7';

      if (chainId !== sepoliaChainId) {
        alert('You are not connected to the Sepolia Testnet!');
        return;
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' })

      console.log('Found account', accounts[0]);
      setCurrentAccount(accounts[0])
    } catch (error) {
      console.log('Error connecting to metamask', error);
    }
  }

  // Checks if wallet is connected to the correct network
  const checkCorrectNetwork = async () => {
    const { ethereum } = window
    let chainId = await ethereum.request({ method: 'eth_chainId' })
    console.log('Connected to chain:' + chainId)

    const sepoliaChainId = '0xaa36a7'

    if (chainId !== sepoliaChainId) {
      setCorrectNetwork(false)
    } else {
      setCorrectNetwork(true)
    }
  }
  
   // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    connectWallet();
    checkCorrectNetwork();
  });

  // Automatically hide welcome screen after 3 seconds
  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => setShowWelcome(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  // Handle navigation between views
  const handleNavigation = (view) => {
    setCurrentView(view);
  };

  const handleBackToHome = () => {
    setCurrentView('home');
  };

  // Render main content based on current view
  const renderMainContent = () => {
    switch(currentView) {
      case 'profile':
        return <Profile onBack={handleBackToHome} userAddress={currentAccount} />;
      case 'home':
      default:
        return <Feed />;
    }
  };

  return (
    <div className="App">
      {showWelcome ? (
        // Welcome Screen
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <div className="welcome-message">
            
            <h1>Just Flick and Click to access your Grimoire</h1>
            {currentAccount && correctNetwork ? null : (
              <div>
                <p>Please connect your wallet to continue</p>
                <button className="connect-wallet-button" onClick={connectWallet}>
                  Connect Wallet
                </button>
              </div>
            )}
          </div>
        </header>
      ) : (
        // Main App with Feed
        <div className="app-body fade-in">
          <Sidebar onNavigate={handleNavigation} currentView={currentView} />
          {renderMainContent()}
          <Widgets />
        </div>
      )}
    </div>
  );
}

export default App;