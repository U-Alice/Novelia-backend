const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();
const mongoose = require("mongoose");
const Router = require("express").Router;
const {
  uploadBook,
  getUploads,
  getOne,
  getChildrenBooks,
  topTen,
  getByGenre,
  getBooksByGenre,
} = require("./handlers/handlers");
const {
  login,
  register,
  forgotPassword,
  oAuth,
  getTokens,
  getGoogleUser,
  uploadProfile,
  getImage,
} = require("./handlers/userController");
const { GoogleAuth } = require("google-auth-library");
const { auth } = require("./handlers/auth");
const { createList, getList, deleteBook } = require("./handlers/readListControllers");
const { conversations } = require("./handlers/conversations");

module.exports.router = (app, db) => {
  router.post("/login", login());
  router.post("/register", register());
  router.post("/reset", forgotPassword());
  router.post("/upload", uploadBook());
  router.get("/getAuth", oAuth());
  router.get("/auth/google", getGoogleUser());
  router.post("/uploaded", (req, res) => {
    console.log(req.file);
  });
  router.get("/home", (req, res) => {
    res.send("working");
  });
  router.get("/childrenBooks", getChildrenBooks());
  router.get("/topTen", topTen());
  router.post("/addProfile", auth(), uploadProfile());
  router.get("/getByGenre", getBooksByGenre());
  router.get("/getProfile", auth(), getImage());
  router.get("/getBook/:_id", getOne());
  router.post("/newList/:bookId",auth(), createList());
  router.get("/getList",auth(),  getList());
  router.get("/deleteBook/:bookId",auth(), deleteBook());

  router.post("/newConversation",auth(), conversations());

  app.use(router);
};
