const message = require("../models/chat/message")

module.exports.newMessage = () =>{
    return async (req, res)=>{
        const newMessage = new message(req.body)
        try{
         const savedMessage = await newMessage.save()
         res.status(200).send(savedMessage)
        }catch(err){
            res.status(500).json(err)
        }
    }
}
module.exports.getMessages = ()=>{
    return async (req, res)=>{
        try{
            console.log(req.params.conversationId)
        const messages = await message.find({conversationId : req.params.conversationId})
        res.status(200).json(messages)
        }catch(err){
            res.status(200).send(err)
        }
    }
}