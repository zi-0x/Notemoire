import React, { useContext, useEffect, useRef, useState } from 'react';
import noteContext from '../Contexts/Notes/Notecontext';
import NoteItem from './NoteItem';
import NoteAIActions from './NoteAIActions';
import { useNavigate } from 'react-router-dom';
import './Notes.css';


const Notes = (props) => {
    const context = useContext(noteContext);
    const { notes, getNotes, editnote } = context;

    const navigate = useNavigate();

    const ref = useRef(null);
    const refclose = useRef(null);

    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('token')) {

            localStorage.getItem('token')
            getNotes();
            setAuthChecked(true);
        } else {
            navigate("/login");
        }
    }, []);

    const [note, setNote] = useState({
        title: " ",
        description: " ",
        tag: " "
    });

    const updateNote = (currentNote) => {
        //When editing icon is hit, this function is called and ref.current.click clicks the modal button which is hidden because of the d-none class, which then opens the modal
        ref.current.click();
        setNote(currentNote)
        props.showAlert("Updated successfully", "success")

    };
    //Addnote functions defined again for form in modal
    const handleclick = (e) => {
        e.preventDefault(); // required to prevent form reload
        editnote(note._id, note.title, note.description, note.tag)
        refclose.current.click()
    };

    const onChange = (e) => {
        // ...note means keep other values inside the note array same
        // e.target.name means whichever component's name is being changed, its name is set to its value 
        setNote({ ...note, [e.target.name]: e.target.value });
    };
console.log("showAI in Notes:", props.showAI);
    if (!authChecked) return null;

    return (
        <>

            {/* Hidden button to trigger modal */}
            <button
                type="button"
                ref={ref}
                className="btn btn-primary d-none"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
            >
                Launch demo modal
            </button>

            {/* Modal */}
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Note</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {/* addnote form is called as modal body  */}
                            <form>
                                <div className="mb-3 my-3">
                                    <label htmlFor="title" className="form-label">Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="title"
                                        name="title"
                                        value={note.title}
                                        onChange={onChange}
                                    />
                                    {note.title.trim().length > 0 && note.title.trim().length < 3 && (
                                        <div className="text-danger">Title must be at least 3 characters.</div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="desc" className="form-label">Description</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="description"
                                        name="description"
                                        value={note.description}
                                        onChange={onChange}
                                    />
                                    {note.description.trim().length > 0 && note.description.trim().length < 5 && (
                                        <div className="text-danger">Description must be at least 5 characters.</div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="desc" className="form-label">Tag</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="tag"
                                        name="tag"
                                        value={note.tag}
                                        onChange={onChange}
                                    />
                                    {note.tag.trim().length > 0 && note.tag.trim().length < 2 && (
                                        <div className="text-danger">Tag must be at least 2 characters.</div>
                                    )}
                                </div>


                            </form>

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" ref={refclose}>Close</button>
                            <button
                                disabled={
                                    note.title.trim().length < 3 ||
                                    note.description.trim().length < 5
                                }
                                type="submit"
                                className="btn btn-primary"
                                onClick={handleclick}
                            >
                                Update note
                            </button>

                        </div>
                    </div>
                </div>
            </div>

            <div className="notes-container my-3 "> <h2>My Notes</h2> 
             <div className="note-list"> {notes.length === 0 && 
                <p>No notes to display</p>} 
                {[...notes].reverse().map((note) => (
                     <NoteItem key={note._id} 
                        updateNote={updateNote} 
                        note={note} 
                        showAlert={props.showAlert} 
                        showAI={props.showAI} 
  />
))}
              </div>
            </div>
        </>
    );
};

export default Notes;
