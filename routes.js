const express = require('express');
const router = express.Router()
const crypto = require('crypto')
const multer = require('multer')
const GridFsStorage = require('multer-gridfs-storage')
const storage = new GridFsStorage({
 url: process.env.URL, 
 file:(req, res)=>{
     return new Promise((resolve, reject)=>{
         crypto.randomBytes(16, (err, buf)=>{
             if(err){
                 return reject(err)
             }
             const filename = buf.toString('hex') + path.extname(file.originalname);
             const fileinfo = {
                 filename: filename, 
                 bucketName: 'uploads'
             }
             resolve(fileinfo)
         })
     })
 }
})
const upload = multer({storage})
const {uploadBook} = require('./handlers/handlers');
const { GridFsStorage } = require('multer-gridfs-storage');

module.exports.router = (app)=>{
    router.post('/newBook' ,upload.single('book'), uploadBook());
    app.use(router)
    router.get('/uploaded', (req, res, next)=>{
    gsf.find().toArray((err, files)=>{
        if(!files || files.length === 0 ){
            return res.status(200).json({
                success: false, 
                message: "No files available"
            })
        } 
        files.map(file =>{
            if(file.contentType === 'image/jpeg' || file.contentType === "image/png" || file.contentType === "image/svg+xml"){
                file.isImage = true;
            }else{
                file.isImage = false;
            }
        })
        res.status(200).json({
            success: true, files
        })
    })
    })
}