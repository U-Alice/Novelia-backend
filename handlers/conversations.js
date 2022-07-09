const { Conversation } = require("../models/chat/conversation");

module.exports.conversations = () => {
  return async (req, res) => {
    console.log(req.body)
    const newConversation = new Conversation({
      members: [req.body.senderId, req.body.receiverId],
    });
    try {
      const savedConversation =await newConversation.save();
      res.status(200).json(savedConversation);
    } catch (err) {
      res.status(500).json(err);
    }
  };
};

module.exports.getConv = () => {
  return async (req, res) => {
    try {
      const conversations = await Conversation.find({members: req.user});
      res.status(200).send(conversations);
    } catch (err) {
      res.status(500).json(err);
    }
  };
};
