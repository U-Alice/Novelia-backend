const express = require("express");
const router = express.Router();

const dotenv = require("dotenv");
const path = require("path");
dotenv.config();

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
  getUser,
  getUsers,
} = require("./handlers/userController");
const { GoogleAuth } = require("google-auth-library");
const { auth } = require("./handlers/auth");
const { createList, getList, deleteBook } = require("./handlers/readListControllers");
const { conversations, getConv } = require("./handlers/conversations");
const { newMessage, getMessages } = require("./handlers/messages");
const { uploadFile } = require("./handlers/filesController");

module.exports.router = (app, db) => {
  router.get("/", (req, res)=>{
    res.send("Welcome to novelia backend")
  })
  router.post("/login", login());
  router.post("/register", register());
  router.post("/reset", forgotPassword());
  router.post("/uploadBook", uploadFile());
  router.get("/getAuth", oAuth());
  router.get("/auth/google", getGoogleUser());
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
  router.get("/conversations", auth(), getConv())
  router.post("/newMessage",auth(),  newMessage());
  router.get("/messages/:conversationId",auth(), getMessages());
  router.get("/getUser/:userId",auth(),  getUser());
  router.get("/getUsers",  getUsers());
  app.use(router);
};
