const express = require('express');
const router = express.Router()
const crypto = require('crypto')
const multer = require('multer')
const {GridFsStorage} = require('multer-gridfs-storage');
const dotenv = require('dotenv');
const path = require('path')
dotenv.config()
const mongoose = require('mongoose');
// const {login, register, recover} = require('../controllers/userController.js')
// const auth = require('../middleware/auth')
// const express = require('express')
const Router = require('express').Router
// const Grid = require('gridfs-stream');

// const storage = new GridFsStorage({
//  url: process.env.URL, 
//  file:(req, file)=>{
//      return new Promise((resolve, reject)=>{
//          crypto.randomBytes(16, (err, buf)=>{
//              if(err){
//                  return reject(err);
//              }
//              const filename = buf.toString('hex') + path.extname(file.originalname);
//              const fileinfo = {
//                  filename: filename, 
//                  bucketName: 'uploads',
//                  bookId: req.body.bookId
//              }
//              resolve(fileinfo);
//          })
//      })
//  }
// })
// const upload = multer({storage})
const {uploadBook, getUploads, getOne, getBooks} = require('./handlers/handlers');
const { login, register, forgotPassword, oAuth } = require('./handlers/userController');
const { GoogleAuth } = require('google-auth-library');



module.exports.router= (app, db)=>{
    
    router.post('/login',login());
    router.post('/register', register());
    router.post('/reset', forgotPassword())
    router.post('/upload',uploadBook());
    router.get('/getBOoks', getBooks());
    router.get('/getAuth', oAuth());
    router.get('/auth/google', )
    router.post('/uploaded', (req, res)=>{
        console.log(req.file)
    })
    app.use(router)

}
