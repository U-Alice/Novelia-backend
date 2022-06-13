const uuid = require("uuid");
const { Book, childrenBooks } = require("../models/bookModel");
const _ = require("lodash");
const cloudinary = require("cloudinary").v2;
const mongoose = require("mongoose");
const multer = require("multer");
const Grid = require("gridfs-stream");
const dotenv = require("dotenv");
const { ReadStream } = require("fs-extra");
const { GridFSBucket } = require("mongodb");
const rapidApi = require("rapidapi-connect");
const { result } = require("lodash");
const rapid = new rapidApi("", "");
dotenv.config();

cloudinary.config({
  cloud_name: "daso1btiz",
  api_key: "468557256968463",
  api_secret: "3S13jGO6WJPZ6-ojNFRUZmeshaY",
  secure: true,
});
const conn = mongoose.createConnection(process.env.URL);
// Init gfs
let gfs;
let gridFs;
conn.once("open", () => {
  gridFs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads",
  });
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("uploads");
});
module.exports.uploadBook = () => {
  return async (req, res) => {
    try {
      console.log(req.file);
      if (req.file) {
        const newBook = _.pick(req.body, [
          "name",
          "year",
          "rating",
          "author",
          "preview",
        ]);
        cloudinary.uploader.upload(req.file.filename, (error, result) =>
          console.log(result, error)
        );
        const saveBook = new Book(newBook);
        await saveBook.save();
      } else {
        res.send("no file chosen");
      }
    } catch (error) {
      console.log(error);
    }
  };
};

module.exports.getUploads = (req, res, next) => {
  gfs.files.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(404).json({
        err: "No files exist",
      });
    }
    return res.json(files);
  });
};

module.exports.getChildrenBooks = () => {
  return async (req, res) => {
    let books = [];
    let book;
    const axios = require("axios");

    const options = {
      method: "GET",
      url: "https://best-childrens-books.p.rapidapi.com/books/timegoodreads",
      headers: {
        "X-RapidAPI-Key": "9657fe62f6msha6e9555c9710604p10b4a2jsn29b89285b70c",
        "X-RapidAPI-Host": "best-childrens-books.p.rapidapi.com",
      },
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        response.data.map(async (item) => {
          const existingBook = await childrenBooks.findOne({
            title: item.title,
          });
          if (!existingBook) {
            book = new childrenBooks(item);
            await book.save();
          }
        
        });
      })
      .catch(function (error) {
        console.error(error);
      });
      
      const availableBooks  = await childrenBooks.find()
      console.log(availableBooks)
      res.json({childrenBooks: availableBooks, success:"true"}).status(200)
  };
};

module.exports.getBooks = () => {
  return async (req, res) => {
    const fetch = require("node-fetch");
    // let books = [];
    // let book;
    // const url = "https://bookshelves.p.rapidapi.com/books";
    // const options = {
    //   method: "GET",
    //   headers: {
    //     "X-RapidAPI-Host": "bookshelves.p.rapidapi.com",
    //     "X-RapidAPI-Key": "9657fe62f6msha6e9555c9710604p10b4a2jsn29b89285b70c",
    //   },
    // };
    // const api = await fetch(url, options);
    // const data = await api.json();
    // console.log(data);

    // data.Books.map(async (item) => {
    //   const existingBook = await Book.findOne({ title: item.title });
    //   if (!existingBook) {
    //     book = new Book(item);
    //     await book.save();
    //   } else {
    //     console.log("found book");
    //   }
    // });

    const availableBooks = await Book.find();
    res.json({ books: availableBooks }).status(400);
  };
};

module.exports.getOne = () => {
  return async (req, res) => {
    try {
      const book = await Book.findOne({ id: req.params.id });
      if (book) {
        res.send({ sucess: true, book: book });
      } else {
        res.json({ message: '"Book not found"' }).status(400);
      }
    } catch (err) {
      console.log(err);
      res.json({ message: "Internal server Errror" });
    }
  };
};

module.exports.topTen = () => {
  return async () => {
    const fetch = require("node-fetch");
    let books = [];
    let book;
    const url = "https://hapi-books.p.rapidapi.com/week/horror";
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Host": "hapi-books.p.rapidapi.com",
        "X-RapidAPI-Key": "9657fe62f6msha6e9555c9710604p10b4a2jsn29b89285b70c",
      },
    };

    const api = await fetch(url, options);
    const data = await api.json();
    console.log(data);
    res.json({ success: true, books: data }).status(200);
  };
};
