
//create storage variable
require('dotenv').config()
const mongoose = require('mongoose');
const database = mongoose.connect(process.env.URL).then((result)=>{
    console.log('connected to the database')
}).catch((error)=>{
    console.log(error)
    console.log('not connected to the database')
})
// database.then((result)=>{

//     console.log(result.db)
// })
module.exports.Book = mongoose.connection.collection("book")
// module.exports.database = database;