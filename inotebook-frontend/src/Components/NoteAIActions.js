import React, { useState, useContext, useEffect } from 'react';
import noteContext from '../Contexts/Notes/Notecontext';
import { generateAIContent, listAvailableModels } from '../Utils/gemini';
import './NoteAIActions.css';

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
      <div className="note-ai-btn-group d-flex flex-wrap gap-2 mt-2">
        <button className="btn" onClick={() => 
          handleGenerate('summary')}>Summary</button>
        <button className="btn" onClick={() => 
          handleGenerate('flashcards')}>Revision Cards</button>
      </div>

        {showModal && (
    <div className="note-ai-backdrop">
      <div className="note-ai-modal">
        <div className="note-ai-modal-header">
          <h5 className="note-ai-title">{modalType?.toUpperCase()}</h5>
          <button onClick={() => setShowModal(false)} className="note-ai-close-btn">×</button>
        </div>
        <div className="note-ai-modal-body">
          <pre>{modalContent}</pre>
        </div>
        <div className="note-ai-modal-footer">
          <button className="btn" onClick={() => setShowModal(false)}>Close</button>
          <button className="btn" onClick={() => handleGenerate(modalType, true)}>Regenerate</button>
        </div>
      </div>
    </div>
  )}
</>

  );
}

