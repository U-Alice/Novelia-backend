const { ObjectId } = require('bson');
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
    author: {
        type: String,
        required: true
    },
    imgUrl:{
        type: String, 
    }, 
    description:{
        type: String
    }, 
    name: {
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
    cover:{
        type: String,
        required: true
    },
    type:{
        type: String,
        required: true,
        default: "romance"
    }
})

module.exports.Romance = mongoose.model('romance',romance)
const science = mongoose.Schema({
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
    cover:{
        type: String,
        required: true
    },
    type:{
        type: String,
        required: true,
        default: "science"
    }
})

module.exports.Science = mongoose.model('science',science)

const comedy = mongoose.Schema({
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
    cover:{
        type: String,
        required: true
    },
    type:{
        type: String,
        required: true,
        default: "comedy"
    }
})

module.exports.Comedy = mongoose.model('comedy',comedy)

const horror = mongoose.Schema({
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
    cover:{
        type: String,
        required: true
    },
    type:{
        type: String,
        required: true,
        default: "horror"
    }
})

module.exports.Horror = mongoose.model('horror',horror)