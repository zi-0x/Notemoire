import { useState } from "react";
import noteContext from "./Notecontext";

const NoteState = (props) => {
  const host = "https://notemore-dashboard.onrender.com";
  const notesInitial = [];
  const [notes, setNotes] = useState(notesInitial);
  const [walletAddress, setWalletAddress] = useState("");
  const { showAlert } = props;

  // Get all notes
  const getNotes = async () => {
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
    });
    const json = await response.json();
    setNotes(json);
  };

  // Add a note
  const addnote = async (title, description, tag) => {
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify({ title, description, tag })
    });
    const json = await response.json();
    setNotes(notes.concat(json));
    showAlert("Note added successfully", "success");
  };

  // Delete a note
  const deletenote = async (id) => {
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      }
    });
    const json = await response.json();
    const newNotes = notes.filter((note) => note._id !== id);
    setNotes(newNotes);
    showAlert("Note deleted successfully", "success");
  };

  // Edit a note
  const editnote = async (id, title, description, tag, aiFields = {}) => {
    const payload = {
      ...(title !== null && { title }),
      ...(description !== null && { description }),
      ...(tag !== null && { tag }),
      ...aiFields
    };

    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify(payload)
    });

    const updatedNote = await response.json();
    const newNotes = notes.map(note =>
      note._id === id ? updatedNote : note
    );
    setNotes(newNotes);
    showAlert("Note edited successfully", "success");
  };

  return (
    <noteContext.Provider
      value={{
        notes,
        addnote,
        deletenote,
        editnote,
        getNotes,
        walletAddress,
        setWalletAddress
      }}
    >
      {props.children}
    </noteContext.Provider>
  );
};

export default NoteState;
