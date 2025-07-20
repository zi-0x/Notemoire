import React, { useState, useContext, useEffect } from 'react';
import noteContext from '../Contexts/Notes/Notecontext';
import { generateAIContent, listAvailableModels } from '../Utils/gemini';

export default function NoteAIActions({ noteId, noteContent, note }) {
  const { editnote } = useContext(noteContext);

  const [modalType, setModalType] = useState(null);
  const [modalContent, setModalContent] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleGenerate = async (type, forceRegenerate = false) => {
    setModalType(type);
    setShowModal(true);

    // Skip API call if data already exists unless user forces regeneration
    if (!forceRegenerate && note?.[type]?.trim()) {
      setModalContent(note[type]);
      return;
    }

    if (!noteContent?.trim()) {
      setModalContent("Content is empty. Cannot generate.");
      return;
    }

    const promptMap = {
      summary: `Summarize the following note:\n\n${noteContent}`,
      flashcards: `Create flashcards (question and answer) based on this content:\n\n${noteContent}`
    };

    setModalContent("Generating...");

    try {
      const generated = await generateAIContent(promptMap[type]);
      setModalContent(generated);
      await editnote(noteId, null, null, null, { [type]: generated });
    } catch (err) {
      setModalContent("Failed to generate content.");
      console.error("Gemini error:", err);
    }
  };



  return (
    <>
      <div className="d-flex flex-wrap gap-2 mt-2">
        <button className="btn btn-outline-primary btn-sm" onClick={() => handleGenerate('summary')}>Summary</button>
        <button className="btn btn-outline-success btn-sm" onClick={() => handleGenerate('flashcards')}>Revision Cards</button>
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
              <button className="btn btn-secondary me-2" onClick={() => setShowModal(false)}>Close</button>
              <button className="btn btn-secondary" onClick={() => handleGenerate(modalType, true)}>Regenerate</button>
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
