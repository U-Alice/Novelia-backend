const mongoose = require('mongoose');
const uuid = require('uuid')
const bookSchema = mongoose.Schema({
    bookId:{
        type: String,
        default: uuid.v4()
    },
    name: {
        type: String,
        required: true,
    },
    year: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    preview:{
        type: String, 
        required: true
    }, 
    rating:{
        type: String,
        required: true
    },

})
module.exports.Book = mongoose.model('Book',bookSchema)