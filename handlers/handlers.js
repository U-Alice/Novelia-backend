const uuid = require("uuid");
const {
  Book,
  childrenBooks,
  Romance,
  Comedy,
  Horror,
  Science,
} = require("../models/bookModel");
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
// const db = mongoose.connection;
dotenv.config();

cloudinary.config({
  cloud_name: "daso1btiz",
  api_key: "468557256968463",
  api_secret: "3S13jGO6WJPZ6-ojNFRUZmeshaY",
  secure: true,
});
// Init gfs

module.exports.getChildrenBooks = () => {
  return async (req, res) => {
    let books = [];
    let book;
    const axios = require("axios");

    const options = {
      method: "GET",
      url: "https://best-childrens-books.p.rapidapi.com/books/timegoodreads",
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
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

    const availableBooks = await childrenBooks.find();
    console.log(availableBooks);
    res.json({ childrenBooks: availableBooks, success: "true" }).status(200);
  };
};

module.exports.getOne = () => {
  return async (req, res) => {
    try {
      const id = mongoose.Types.ObjectId(req.params._id.trim());
      const book = await Book.findById(id);
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
  return async (req, res) => {
    try {
      let books = await Book.find();

      if (books) {
        res.json({ message: "Successful", status: "ok", books: books });
      } else {
        res.json({ message: "Successful", status: "ok", books: books });
      }
    } catch (error) {
      console.log(error);
      res.json({ message: "Internal Server error", status: "Failed" });
    }
  };
};

module.exports.getBooksByGenre = () => {
  return async (req, res) => {
    let books = [];
    try {
      const genre = req.query.genre;
      if (genre === "romance") {
        books = await Romance.find();
      }
      switch (genre) {
        case "romance":
          books = await Romance.find();
          break;
        case "horror":
          books = await Horror.find();
          break;
        case "science":
          books = await Science.find();
          break;
        case "comedy":
          books = await Comedy.find();
          break;
        default:
          res.json({ message: "Could not find requested genre" });
          break;
      }
      res.json({ success: true, books: books }).status(200);
    } catch (err) {
      res.json({ success: false, error: "Internal server Error" });
      console.log(err);
    }
  };
};
