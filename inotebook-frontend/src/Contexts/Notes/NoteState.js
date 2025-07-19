import { useState } from "react";
import noteContext from "./Notecontext";

// Sample initial notes array (assuming you had this)
const notesInitial = [];

const NoteState = (props) => {
  const host = "http://localhost:5000";
  const [notes, setNotes] = useState(notesInitial);
  const {showAlert}=props

  // Get all notes 
  const getNotes = async () => {
    // API call 
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
    });
    const json = await response.json();
    setNotes(json)
  };

  // ADD A NOTE 
  const addnote = async (title, description, tag) => {
    // API call 
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description, tag })
    });
    const json = await response.json();
    console.log("adding a new note");
  
    setNotes(notes.concat(json));
    showAlert("Note added successfully", "success")
  };

  // DELETE A NOTE
  const deletenote = async (id) => {
    //API call 
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },

    });
    const json = await response.json()
    console.log(json)
    const newNotes = notes.filter((note) => { return note._id !== id });
    setNotes(newNotes);
        showAlert("Note deleted successfully", "success")

  };

  // EDIT A NOTE 
  const editnote = async (id, title, description, tag) => {
    // API call 
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description, tag })
    });
    console.log("Editing the note with id " + id);
    const newNotes = [...notes];
    for (let i = 0; i < newNotes.length; i++) {
      if (newNotes[i]._id === id) {
        newNotes[i].title = title;
        newNotes[i].description = description;
        newNotes[i].tag = tag;
        break;
      }
    }
    setNotes(newNotes);
        showAlert("Note edited successfully", "success")

  };

  return (
    <noteContext.Provider value={{ notes, addnote, deletenote, editnote, getNotes }}>
      {props.children}
    </noteContext.Provider>
  );
};

export default NoteState;
