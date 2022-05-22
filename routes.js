const express = require('express');
const router = express.Router()
const multer = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, './uploads')
    },
    filename: (req, file, cb)=>{
        cb(null, file.originalname )
    }
})
const upload = multer({storage: storage})
const {uploadBook} = require('./handlers/handlers')

module.exports.router = (app)=>{
    router.post('/newBook' ,upload.single('book'), uploadBook())
    app.use(router)
}