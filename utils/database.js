
//create storage variable
require('dotenv').config()
const mongoose = require('mongoose');
const database = mongoose.connect("mongodb+srv://Alice:alice22@cluster0.7r4ol.mongodb.net/Eread?retryWrites=true&w=majority").then((result)=>{
    console.log('connected to the database')
}).catch((error)=>{
    console.log(error)
    console.log('not connected to the database')
})

module.exports.Book = mongoose.connection.collection("book")
// module.exports.database = database;