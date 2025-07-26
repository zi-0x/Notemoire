import React, { useContext, useState } from 'react';
import noteContext from '../Contexts/Notes/Notecontext';


const Addnote = () => {
    const context = useContext(noteContext);
    const { notes, addnote } = context;

    const [note, setNote] = useState({
        title: " ",
        description: " ",
        tag: " "
    });

    const handleclick = (e) => {
        e.preventDefault(); // required to prevent form reload
        addnote(note.title, note.description, note.tag);
        setNote({
            title: " ",
            description: " ",
            tag: " "
        })
    };

    const onChange = (e) => {
        // ...note means keep other values inside the note array same
        // e.target.name means whichever component's name is being changed, its name is set to its value 
        setNote({ ...note, [e.target.name]: e.target.value });
    };

    return (
        <div>
            <div className='my-3'>
                <h2> Add a note </h2>
                <div className='container'>
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
                               <div style={{ color: "#bb2b7a" }}>Title must be at least 3 characters.</div>

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
                                <div style={{ color: "#bb2b7a" }}>Description must be at least 5 characters.</div>
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
                                <div style={{ color: "#bb2b7a" }}>Tag must be at least 2 characters.</div>
                            )}
                        </div>

                        <button
                            disabled={
                                note.title.trim().length < 3 ||
                                note.description.trim().length < 5
                            }
                            type="submit"
                            className="btnaddnote"
                            onClick={handleclick}
                        >
                            Add note
                        </button>
                    </form>

                    <div className='my-3'></div>
                </div>
            </div>
        </div>
    );
};

export default Addnote;
