const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3002;


app.use(express.static('public'));
// Handles Data parsing

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Path to db.json
const db = './db/db.json';

// API Routes
app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, db));
    });

    // Assigns ID to saved notes
app.get('/api/notes/:id', (req, res) => {
    fs.readFile(db, 'utf8', function (err, data) {
        let savedNotes = JSON.parse(data);
        // Sends response for Specific ID.
        res.json(savedNotes[Number(req.params.id)]);
    });
})

// POST
app.post('/api/notes', (req, res) => {
    // Reads through information in db.json
    fs.readFile(db, 'utf8', function (err, data) {
        if (err) {
            throw err;
        }
        // Set var for data retrieved
        let savedNotes = JSON.parse(data);
        // Set var for new notes
        let newNote = req.body;
        // Set number of notes saved to use as an ID to string
        let ID = (savedNotes.length).toString();

        newNote.id = ID;

        savedNotes.push(newNote);

        fs.writeFile(db, JSON.stringify(savedNotes), err => {
            if (err) {
                throw err;
                console.log("New note saved!");
            }});
            res.json(req.body);
        });
    });

// DELETE
app.delete('/api/notes/:id', (req, res) => {
    // reads saved data/notes in db.json
    fs.readFile(db, 'utf8', function (err, data) {
        if(err) {
            throw err;
        }
        let savedNotes = JSON.parse(data);
        let noteID = req.params.id;
        let newID = 0;
        console.log (`Note ${noteID} has been deleted!`);
        // filter through notes
        savedNotes = savedNotes.filter(function (currentNote) {
            return currentNote.id != noteID;
        });
        for (currentNote of savedNotes) {
            currentNote.id = newID.toString();
            newID++;
        }
        // Write new ID into the notes.
        fs.writeFile(db, JSON.stringify(savedNotes), err => {
            if (err) throw err;
            res.end();
        });
    });
});

// HTML Routes

// Grabs /notes goes to notes.html
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// get * goes to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () =>  {
    console.log(`Listening at ${PORT}`);
});
