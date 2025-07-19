import React, { useContext, useEffect } from 'react'
import noteContext from '../Contexts/Notes/Notecontext'
import Notes from './Notes'
import Addnote from './Addnotes'
import { useNavigate } from 'react-router-dom';

const Home = (props) => {
    const navigate = useNavigate();
  const {showAlert}= props
    useEffect(() => {
    if (!localStorage.getItem('token')) {
      showAlert("Login to access home", "warning");
      navigate("/login");
    }
    // No else block needed — Notes will render below if token exists
  }, []);
  return (
    <>
    <Addnote showAlert={showAlert}/>
    <Notes showAlert={showAlert}/>
    </>
  )
}

export default Home
