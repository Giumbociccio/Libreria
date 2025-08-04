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
    const { isbn, publisher, author, title, genre, minPages = 0, maxPages, place } = req.query;
    fs.readFile(
        "./database.json",
        { encoding: "utf-8" },
        function (err, data) {
            if (err) {
                res.status(500).send("Errore nella lettura del file");
                return;
            }
            let books = JSON.parse(data)
            if (isbn) {
             books.filter(book => book.isbn === isbn);
            }
            if (publisher) {
             books.filter(book => book.publisher.toLowerCase().contains(publisher.toLowerCase()));
            }
            if (author) {
             books.filter(book => book.author.toLowerCase().contains(author.toLowerCase()));
            }
            if (title) {
             books.filter(book => book.title.toLowerCase().contains(title.toLowerCase()));
            }
            if (genre) {
             books.filter(book => book.genre.toLowerCase().contains(genre.toLowerCase()));
            }
            if (maxPages) {
             books.filter(book => book.pages >= minPages && book.pages <= maxPages);
            }
            if (place) {
             books.filter(book => book.place === place);
            }
            res.json(books)
        }
    )
})



app.listen(port, () => console.log(`Hello world app listening on port ${port}!`))