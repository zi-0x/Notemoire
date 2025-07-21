const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const fetchUser = require('../Middleware/fetchUser');
const Notes = require('../modules/NOTES');

// Route 1: Get all notes of a user (Web2 or Web3)
router.get('/fetchallnotes', fetchUser, async (req, res) => {
    try {
        let notes;
        if (req.user && req.user.id) {
            // Web2: fetch by MongoDB user ID
            notes = await Notes.find({ user: req.user.id });
        } else if (req.user && req.user.walletAddress) {
            // Web3: fetch by wallet address
            notes = await Notes.find({ walletAddress: req.user.walletAddress.toLowerCase() });
        } else {
            return res.status(401).json({ error: "Authentication failed" });
        }
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
});

// Route 2: Add a new note
router.post('/addnote', fetchUser, [
    body('title', 'Enter a valid title').isLength({ min: 1 }),
    body('description', 'Enter a valid description').isLength({ min: 1 })
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const noteData = {
            title,
            description,
            tag
        };

        // Assign user ID or wallet address
        if (req.user && req.user.id) {
            noteData.user = req.user.id;
        } else if (req.user && req.user.walletAddress) {
            noteData.walletAddress = req.user.walletAddress.toLowerCase();
        } else {
            return res.status(401).json({ error: "Authentication required" });
        }

        const note = new Notes(noteData);
        const savedNote = await note.save();
        res.json(savedNote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
});

// Route 3: Update an existing note
router.put('/updatenote/:id', fetchUser, async (req, res) => {
    const { title, description, tag, summary, flashcards, quiz } = req.body;
    const newNote = {};
    if (title) newNote.title = title;
    if (description) newNote.description = description;
    if (tag) newNote.tag = tag;
    if (summary !== undefined) newNote.summary = summary;
    if (flashcards !== undefined) newNote.flashcards = flashcards;
    if (quiz !== undefined) newNote.quiz = quiz;

    try {
        let note = await Notes.findById(req.params.id);
        if (!note) return res.status(404).send("Note not found");

        const userId = req.user?.id;
        const walletAddress = req.user?.walletAddress?.toLowerCase();

        const isOwner =
            (userId && note.user?.toString() === userId) ||
            (walletAddress && note.walletAddress?.toLowerCase() === walletAddress);

        if (!isOwner) {
            return res.status(401).send("Not authorized");
        }

        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json(note);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
});

// Route 4: Delete a note
router.delete('/deletenote/:id', fetchUser, async (req, res) => {
    try {
        let note = await Notes.findById(req.params.id);
        if (!note) return res.status(404).send("Note not found");

        const userId = req.user?.id;
        const walletAddress = req.user?.walletAddress?.toLowerCase();

        const isOwner =
            (userId && note.user?.toString() === userId) ||
            (walletAddress && note.walletAddress?.toLowerCase() === walletAddress);

        if (!isOwner) {
            return res.status(401).send("Not authorized");
        }

        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({ success: "Note has been deleted", note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
});

module.exports = router;
