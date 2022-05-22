const express = require('express');
const router = express.Router
const multer = require('multer')
const {uploadBook} = require('./handlers/handlers')
const upload = multer({dest: '/uploads'})

module.exports.router = (app)=>{
    router.post('/newBook',upload.single('book') , uploadBook)
    app.use(router)
}