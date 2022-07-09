const {Conversation} = require("../models/chat/conversation")

module.exports.conversations = ()=>{
    return async (req, res)=>{
        const newConversation = new Conversation({
            members: [req.body.senderId, req.body.receiverId ],
        })
        try{
        const savedConversation = newConversation.save()
        res.status(200).json(savedConversation);
        }catch(err){
            res.status(500).json(err)
        }
    }
}

module.exports.getConv(()=>{
    return async (req, res)=>{
        try{
           const conversation = Conversation.find({members: req.user}) 
        }catch(err){
            res.status(500).json(err)

        }
    }
})