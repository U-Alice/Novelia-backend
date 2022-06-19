const express = require('express');
const router = express.Router()
const crypto = require('crypto')
const multer = require('multer')
const {GridFsStorage} = require('multer-gridfs-storage');
const dotenv = require('dotenv');
const path = require('path')
dotenv.config()
const mongoose = require('mongoose');
const Router = require('express').Router
const {uploadBook, getUploads, getOne, getBooks, getChildrenBooks, topTen, getByGenre, getBooksByGenre} = require('./handlers/handlers');
const { login, register, forgotPassword, oAuth, getTokens, getGoogleUser, uploadProfile } = require('./handlers/userController');
const { GoogleAuth } = require('google-auth-library');
const auth = require('registry-auth-token');



module.exports.router= (app, db)=>{
    router.post('/login',login());
    router.post('/register', register());
    router.post('/reset', forgotPassword())
    router.post('/upload',uploadBook());
    router.get('/getBooks',auth(), getBooks());
    router.get('/getAuth', oAuth());
    router.get('/auth/google', getGoogleUser())
    router.post('/uploaded', (req, res)=>{
        console.log(req.file)
    })
    router.get('/home', (req, res)=>{
        res.send("working")
    })
    router.get('/childrenBooks',auth(), getChildrenBooks())
    router.get('/topTen',auth(), topTen())
    router.post('/addProfile',auth(),uploadProfile())
    router.get('/getByGenre', getBooksByGenre())
    app.use(router)

}
