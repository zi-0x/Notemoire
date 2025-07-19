import React, { useContext } from 'react';
import noteContext from '../Contexts/Notes/Notecontext';

const NoteItem = (props) => {
  const context = useContext(noteContext);
  const { deletenote } = context;

  const { note, updateNote } = props;

  return (
    <div className="card my-3" style={{ minHeight: "180px" }}>
      <div className="card-body d-flex flex-column justify-content-between h-100 text-start">
        
        {/* Title left, badge right */}
        <div className="d-flex justify-content-between align-items-start">
          <h5 className="card-title mb-1">{note.title}</h5>
          <span className="badge bg-secondary">{note.tag}</span>
        </div>

        {/* Description just below */}
        <p className="card-text mt-2 mb-0">{note.description}</p>

        {/* Icons at the bottom left */}
        <div className="mt-2">
          <i
            className="fa-solid fa-trash me-3"
            role="button"
            onClick={() => { deletenote(note._id); }}
          ></i>
          <i
            className="fa-solid fa-pen-to-square"
            role="button"
            onClick={() => { updateNote(note); }}
          ></i>
        </div>
      </div>
    </div>
  );
};

export default NoteItem;
