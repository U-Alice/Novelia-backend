const { List } = require("../models/readListModel")
const lodash = require('lodash')
const { Book } = require("../models/bookModel")
const { ownKeys } = require("core-js/fn/reflect")

module.exports.createList = async (req, res, next) => {
    const token = req.body.token
    const id = jwtDecode(token).id
    const requestBody = lodash.pick(req.body, ['bookName'])
    const existingList = List.findOne({userId : id})
    const selectedBook = Book.findOne({id: req.body.bookId})
    if(!existingList){
         newList = new List({
             userId: id, 
             bookDetails: selectedBook
            })
        await newList.save().then(() => {
            return res.status(200).send('List created successfully');
        })
    }else{
         existingList = List.findOneAndUpdate({userId: id}, {
        $push : {bookDetails: selectedBook},
        $inc : {count: 1}
         })
         res.send(existingList)
    }
}
module.exports.getList = async (req, res)=>{
    try{
     const userId  = req.params.Id
     const list = List.findOne({_id: userId})

     if(List){
         return res.json({status: oK, List: list}).status(200)
     }
     else{
        return  res.json({status: OK, message:"no existing list, create new"}).status(200)
     }
    }catch(error){
         res.json({error: error, message:"Internal server error"}).status(500)
    }
}