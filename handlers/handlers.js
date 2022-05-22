const uuid = require('uuid');
// const {Book} = require('../models/bookModel')
module.exports.uploadBook =()=>{
return async (req, res)=>{
    if(req.file){
       const newBook = new Book({
             bookId : uuid.v4(),
             name: req.body.name,
             publishedYearr: req.body.year,
             rating: req.body.rating,
             author: req.body.author,
             preview: req.body.preview
       })
       await  newBook.save()
    }
}
}