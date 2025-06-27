import logo from './soclogo.jpeg';
import Sidebar from "./Sidebar";
import Feed from "./Feed";
import Widgets from "./Widgets";
import "./App.css";
import { useState, useEffect } from "react";
import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

function App() {

  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);
  const [currentAccount, setCurrentAccount] = useState('');
  const [correctNetwork, setCorrectNetwork] = useState(false);

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

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div>
         <h1>Welcome to Sociva!</h1>
         <p>Your space to Siv your thoughts, freely and securely.</p>
       </div>
        
      </header>
    </div>
  );
}

export default App;
