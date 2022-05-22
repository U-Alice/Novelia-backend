const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
    bookId:{
        type: String,
        required: true
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
modules.exports.Book = mongoose.model('Book',bookSchema)