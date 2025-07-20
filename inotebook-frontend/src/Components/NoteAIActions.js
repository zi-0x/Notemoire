import React, { useState, useContext } from 'react';
import noteContext from '../Contexts/Notes/Notecontext';

export default function NoteAIActions({ noteId, noteContent, note }) {
  const { editnote } = useContext(noteContext);

  const [modalType, setModalType] = useState(null);
  const [modalContent, setModalContent] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleGenerate = async (type) => {
    setModalType(type);
    setShowModal(true);

    // ✅ If already present in note, show it
    if (note && note[type]) {
      setModalContent(note[type]);
      return;
    }

    // ✅ Otherwise, fake generate and save
    let generated = "";
    if (type === 'summary') {
      generated = "📝 Summary of the note: \n• Point 1\n• Point 2";
    } else if (type === 'flashcards') {
      generated = "📇 Q: What is JavaScript?\nA: A scripting language.";
    } else if (type === 'quiz') {
      generated = "❓ Q1: What is React?\nA. Library\nB. Language\nC. Framework\nD. Compiler";
    }

    // Show it immediately
    setModalContent(generated);

    // ✅ Save to DB using editnote with only that one field
    await editnote(noteId, null, null, null, { [type]: generated });
  };

  return (
    <>
      <div className="d-flex flex-wrap gap-2 mt-2">
        <button className="btn btn-outline-primary btn-sm" onClick={() => handleGenerate('summary')}>🧠 Summary</button>
        <button className="btn btn-outline-success btn-sm" onClick={() => handleGenerate('flashcards')}>📇 Revision Cards</button>
        <button className="btn btn-outline-warning btn-sm" onClick={() => handleGenerate('quiz')}>❓ Quiz</button>
      </div>

      {showModal && (
        <div style={styles.backdrop}>
          <div style={styles.modal}>
            <div style={styles.header}>
              <h5 style={styles.title}>{modalType?.toUpperCase()}</h5>
              <button onClick={() => setShowModal(false)} style={styles.closeButton}>×</button>
            </div>
            <div style={styles.body}>
              <pre style={styles.content}>{modalContent}</pre>
            </div>
            <div style={styles.footer}>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  backdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0,0,0,0.75)',
    zIndex: 999,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    background: 'rgba(255,255,255,0.08)',
    backdropFilter: 'blur(8px)',
    color: 'white',
    borderRadius: '16px',
    padding: '20px',
    width: '90%',
    maxWidth: '600px',
    border: '1px solid rgba(255,255,255,0.2)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1rem',
  },
  title: {
    fontWeight: 'bold',
  },
  closeButton: {
    background: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '1.5rem',
    cursor: 'pointer',
  },
  body: {
    maxHeight: '300px',
    overflowY: 'auto',
    marginBottom: '1.5rem',
  },
  content: {
    whiteSpace: 'pre-wrap',
  },
  footer: {
    textAlign: 'right',
  },
};
