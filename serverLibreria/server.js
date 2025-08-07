const fs = require("fs");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const cors = require("cors");
const path = require("path");

app.use(cors());

// body-parser è integrato in express da v4.16 in poi
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Serve il frontend HTML dalla cartella "Libreria"
app.use(express.static(path.join(__dirname, "../libreria")));

app.get("/", function (req, res) {
  res.send("Server ONLINE");
});

app.post("/books", (req, res) => {
  const book = req.body;

  fs.readFile("./database.json", { encoding: "utf-8" }, function (err, data) {
    if (err) {
      res.status(500).send("Errore nella lettura del file");
      return;
    }
    let books = JSON.parse(data);

    console.log(book);
    books.push(book);

    fs.writeFile(
      "./database.json",
      JSON.stringify(books, null, 2),
      function (err) {
        if (err) {
          res.status(500).send("Errore nel salvataggio del file");
          return;
        }

        res.send("Libro aggiunto correttamente");
      }
    );
  });
});

app.get("/books", (req, res) => {
  const {
    isbn,
    publisher,
    author,
    title,
    genre,
    minPages = 0,
    maxPages,
    place,
  } = req.query;
  fs.readFile("./database.json", { encoding: "utf-8" }, function (err, data) {
    if (err) {
      res.status(500).send("Errore nella lettura del file");
      return;
    }
    let books = JSON.parse(data);
    if (isbn) {
      books = books.filter((book) => book.isbn === isbn);
    }
    if (publisher) {
      books = books.filter((book) =>
        book.publisher.toLowerCase().includes(publisher.toLowerCase())
      );
    }
    if (author) {
      books = books.filter((book) =>
        book.author.toLowerCase().includes(author.toLowerCase())
      );
    }
    if (title) {
      books = books.filter((book) =>
        book.title.toLowerCase().includes(title.toLowerCase())
      );
    }
    if (genre) {
      books = books.filter((book) =>
        book.genre.toLowerCase().includes(genre.toLowerCase())
      );
    }
    if (maxPages) {
      let min = Number(minPages);
      let max = Number(maxPages);
      books = books.filter(
        (book) => Number(book.pages) >= min && Number(book.pages) <= max
      );
    }
    if (place) {
      books = books.filter((book) => book.place === place);
    }
    res.json(books);
  });
});

app.listen(port, () =>
  console.log(`Hello world app listening on port ${port}!`)
);
