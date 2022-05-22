const uuid = require('uuid');
const { Book } = require('../models/bookModel')
const _ = require('lodash');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: "daso1btiz",
    api_key: "468557256968463",
    api_secret: "3S13jGO6WJPZ6-ojNFRUZmeshaY",
    secure: true

})
module.exports.uploadBook = (req, res) => {
    return async (req, res) => {
        try {
            if (req.file) {
                const newBook = _.pick(req.body, ['name', 'year', 'rating', 'author', 'preview'])
                const saveBook = new Book(newBook)
                await saveBook.save()
                cloudinary.uploader.upload(req.file.path, (error, result)=>{
                    if(error){
                        console.log(error)
                        return res.send(error.message)
                    }else{
                       return res.send(result)
                        console.log(result)
                    }
                })
            } else {
                res.send('no file chosen')
            }
        } catch (error) {
            console.log(error)
        }
    }
}