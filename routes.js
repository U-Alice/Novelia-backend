const express = require('express');
const router = express.Router()
const crypto = require('crypto')
const multer = require('multer')
const {GridFsStorage} = require('multer-gridfs-storage');
const dotenv = require('dotenv');
const path = require('path')
dotenv.config()
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

const storage = new GridFsStorage({
 url: process.env.URL, 
 file:(req, file)=>{
     return new Promise((resolve, reject)=>{
         crypto.randomBytes(16, (err, buf)=>{
             if(err){
                 return reject(err);
             }
             const filename = buf.toString('hex') + path.extname(file.originalname);
             const fileinfo = {
                 filename: filename, 
                 bucketName: 'uploads',
                 bookId: req.body.bookId
             }
             resolve(fileinfo);
         })
     })
 }
})
const upload = multer({storage})
const {uploadBook, getUploads, getOne, getBook} = require('./handlers/handlers');

module.exports.router = (app)=>{
    router.post('/upload', uploadBook(),upload.single('file'));
    router.get('/uploaded', getUploads);
    router.get('/upload/:filename', getOne());
    router.get('/getBOoks', getBook());
app.use(router)

}