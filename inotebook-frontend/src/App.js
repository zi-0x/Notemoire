import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

// Importing all required components
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import Alert from './Components/Alert';
import Login from './Components/Login';
import Signup from './Components/Signup';
import LandingPage from './Components/Landingpage';
import Aienhancement from './Components/Aienhancement';
import './App.css';
import './Components/./Home.css';


import NoteState from './Contexts/Notes/NoteState';

export default function App() {
  const [alert, setAlert] = useState(null);


  // Function to display alert messages
  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type
    });
    setTimeout(() => setAlert(null), 2000);
  };

  // Check if user is logged in (token exists in localStorage)
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  return (
    // Wrapping the whole app in NoteState so that context is available to all components
    <NoteState showAlert={showAlert}>
      <Router>

        <div className="app-layout">
        {/* Show Navbar and Alert only if user is authenticated */}
        {isAuthenticated && <Navbar setIsAuthenticated={setIsAuthenticated} />}
        {isAuthenticated && <Alert alert={alert} />}
<div className="main-content">
        <Routes>
          {/* If logged in, show Home inside container. Otherwise, show full-screen LandingPage */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <div className='container'>
                  <Home showAlert={showAlert} />
                </div>
              ) : (
                <LandingPage />
              )
            }
          /><Route
            path="/ai"
            element={
              isAuthenticated ? (
                <div className='container'>
                  <Aienhancement showAlert={showAlert} />
                </div>
              ) : (
                <LandingPage />
              )
            }
          />


          {/* Login and Signup pages wrapped in container */}
          <Route
            path="/login"
            element={<div className='container'><Login showAlert={showAlert} setIsAuthenticated={setIsAuthenticated} /></div>}
          />
          <Route
            path="/signup"
            element={<div className='container'><Signup showAlert={showAlert} setIsAuthenticated={setIsAuthenticated} /></div>}
          />
        </Routes>
        </div>
</div>
      </Router>
    </NoteState>
  );
}
