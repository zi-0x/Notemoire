const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator'); // For validating input
var fetchUser = require('../Middleware/fetchUser');
const Notes = require('../modules/NOTES');

// Route 1: Get all notes of a user using: GET "/api/notes/fetchallnotes"
router.get('/fetchallnotes', fetchUser, async (req, res) => {
    // Finds all notes in the database where the 'user' field matches the authenticated user's ID
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
});

// Route 2: Adding a new note using: POST "/api/notes/addnote"
router.post('/addnote', fetchUser, [

    // Validation rules for incoming request:
    // 'title' must be at least 1 character long
    body('title', 'Enter a valid title').isLength({ min: 1 }),

    // 'description' must be at least 1 character long
    body('description', 'Enter a valid description').isLength({ min: 1 })

], async (req, res) => {
    try {
        const { title, description, tag } = req.body;

        // Checks if validation errors occurred
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Returns HTTP 400 if validation fails with details of the errors
            return res.status(400).json({ errors: errors.array() });
        }

        // Creates a new note with the given data and links it to the authenticated user
        const note = new Notes({ title, description, tag, user: req.user.id });

        // Saves the note to the database
        const savedNote = await note.save();

        // Returns the saved note as JSON response
        res.json(savedNote);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal error occurred");
    }
});

// Route 3: Updating a note using: PUT "/api/notes/updatenote/:id"
router.put('/updatenote/:id', fetchUser, async (req, res) => {
    const { title, description, tag } = req.body;

    // Creating a new note object with only provided fields
    const newNote = {};
    if (title) newNote.title = title;
    if (description) newNote.description = description;
    if (tag) newNote.tag = tag;

    try {
        // Find the note to be updated
        let note = await Notes.findById(req.params.id);
        if (!note) return res.status(404).send("Not found");

        // Check if the note belongs to the authenticated user
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed");
        }

        // Update the note and return the new one
        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json(note);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal error occurred");
    }
});

// Route 4: Deleting a  note using: DELETE "/api/notes/deletenote"
router.delete('/deletenote/:id', fetchUser, async (req, res) => {
    try{
    //find note to be deleted 
    let note = await Notes.findById(req.params.id);
    if (!note) return res.status(404).send("Not found");

    // Check if the note belongs to the authenticated user
    if (note.user.toString() !== req.user.id) {
        return res.status(401).send("Not allowed");
    }
    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({"Success": "Note has been deleted", note: note});
}

    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal error occurred");
    }
})





    module.exports = router;
