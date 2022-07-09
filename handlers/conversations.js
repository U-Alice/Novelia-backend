const conversation = require("../models/chat/conversation")

module.exports.conversations = ()=>{
    return async (req, res)=>{
        const newConversation = new conversation({
            members: [req.body.senderId, req.body.receiverId ],
        })
        try{
        const savedConversation = newConversation.save()
        }catch(err){
            res.status(500).json(err)
        }
    }
}