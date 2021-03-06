const fs = require("fs");
const express = require("express");
const path = require("path");

let db;

fs.readFile("./db/db.json", (err, data) => {
    if (err) throw err;

    db = JSON.parse(data);
});

const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/notes", (req, res) => res.sendFile(path.join(__dirname, "./public/notes.html")));

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "./public/index.html")));

app.get("/api/notes", (req, res) => res.json(db));

app.post("/api/notes", (req, res) => {
    db.push(req.body);

    const dbString = JSON.stringify(db);

    fs.writeFile("./db/db.json", dbString, (err, data) => {
        if (err) throw err;

        res.end();
    });
});

app.delete("/api/notes/:id", (req, res) => {
    const id = req.params.id - 1;

    db.splice(id, 1);

    const dbString = JSON.stringify(db);

    fs.writeFile("./db/db.json", dbString, (err, data) => {
        if (err) throw err;

        res.end();
    });
});

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
