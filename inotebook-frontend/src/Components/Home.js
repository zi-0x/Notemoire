import React, { useContext, useEffect } from 'react'
import noteContext from '../Contexts/Notes/Notecontext'
import Notes from './Notes'
import Addnote from './Addnotes'
import { useNavigate } from 'react-router-dom';
import './Home.css';


const Home = (props) => {
  const navigate = useNavigate();
  const { showAlert } = props
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      showAlert("Login to access home", "warning");
      navigate("/login");
    }
    // No else block needed — Notes will render below if token exists
  }, []);
  
    return (
    <div className="app-layout">
      <div className="main-content">
  <div className="home-container">
    <div className="add-note-section">
      <Addnote showAlert={showAlert} />
    </div>
    <div className="notes-list-section">
      <Notes showAlert={showAlert} />
    </div>
  </div>
  </div>
  </div>
);

  
}

export default Home
