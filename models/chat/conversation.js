const mongoose = require('mongoose')
const ConversationSchema = new mongoose.Schema({
    member: {
        type: Array,
    }, 

}, {timestamps: true})

module.exports.Conversation = mongoose.model("Conversation", ConversationSchema)