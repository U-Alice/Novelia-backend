const mongoose = require('mongoose');
const uuid = require('uuid');
const bookSchema = mongoose.Schema({
    bookId:{
        type: String,
        default: uuid.v4()
    },
    title: {
        type: String,
        required: true,
    },
    source: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    imgUrl:{
        type: String, 
        required: true
    }, 
    description:{
        type: String
    }, 
    price:{
        type: String, 
        required: true
    }, 
    review: {
        type: String
    }


})
module.exports.Book = mongoose.model('Book',bookSchema)

const romance = mongoose.Schema({
    book_id:{
        type: String,
    },
    name: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true
    },
    authors: {
        type: Array,
        required: true
    },
    rating: {
        type: Number, 
        required: true
    },
    pages: {
        type: Number
    },
    publishedDate:{
        type: Date
    },  
    sypnosis: {
        type: String
    },
    type:{
        type: String,
        required: true,
        default: "romance"
    }
})

module.exports.Romance = mongoose.model('romance',romance)