const fs = require("fs");
const express = require('express');
const app = express();
const port = 3000;

const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", function (req, res) {
    res.send("Server ONLINE");
});


app.post('/books', (req, res) => {
    const book = req.body;

    fs.readFile(
        "./database.json",
        { encoding: "utf-8" },
        function (err, data) {
            if (err) {
                res.status(500).send("Errore nella lettura del file");
                return;
            }
            let books = JSON.parse(data)
            
            console.log(book);
            books.push(book);
            
            fs.writeFile("./database.json", JSON.stringify(books, null, 2), function (err) {
                if (err) {
                    res.status(500).send("Errore nel salvataggio del file");
                    return;
                }
                
                res.send("Libro aggiunto correttamente");
            });
        }
    );
});

app.get('/books', (req, res) => {
    fs.readFile(
        "./database.json",
        { encoding: "utf-8" },
        function (err, data) {
            if (err) {
                res.status(500).send("Errore nella lettura del file");
                return;
            }
            let books = JSON.parse(data)
            res.json(books)
        }
    )
})

app.get('/books/:book', (req, res) => {
    //todo
})


app.listen(port, () => console.log(`Hello world app listening on port ${port}!`))