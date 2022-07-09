const { Conversation } = require("../models/chat/conversation");

module.exports.conversations = () => {
  return async (req, res) => {
    const newConversation = new Conversation({
      members: [req.body.senderId, req.body.receiverId],
    });
    try {
      const savedConversation = newConversation.save();
      res.status(200).json(savedConversation);
    } catch (err) {
      res.status(500).json(err);
    }
  };
};

module.exports.getConv = () => {
  return async (req, res) => {
    try {
      const conversations = Conversation.find({ members: req.user });
      res.status(200).send(conversations);
    } catch (err) {
      res.status(500).json(err);
    }
  };
};
