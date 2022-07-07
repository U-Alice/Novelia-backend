const { List } = require("../models/readListModel");
const lodash = require("lodash");
const { Book } = require("../models/bookModel");
const mongoose = require("mongoose");

module.exports.createList = (req, res, next) => {
  return async (req, res) => {
    const id = req.user;
    console.log(req.params.bookId);
    const bookId = mongoose.Types.ObjectId(req.params.bookId.trim());
    const requestBody = lodash.pick(req.body, ["bookName"]);
    let existingList = await List.findOne({ userId: id });
    const selectedBook = await Book.findById(bookId);

    if (!existingList) {
      newList = new List({
        user_id: id,
        bookDetails: selectedBook,
      });
      await newList.save().then(() => {
        return res.status(200).send("List created successfully");
      });
    } else {
      existingList = await List.findOneAndUpdate(
        { user_id: id },
        {
          $push: { bookDetails: selectedBook },
          $inc: { count: 1 },
        }
      );
    }
    console.log(existingList);
  };
};
module.exports.getList = () => {
  return async (req, res) => {
    try {
      const userId = req.user;
      const list = await List.findOne({ user_id: userId });
      if (list) {
        res
          .json({ status: "oK", List: list.bookDetails, count: list.count })
          .status(200);
      } else {
        return res
          .json({ status: "false", message: "no existing list, create new" })
          .status(200);
      }
    } catch (error) {
      console.log(error);
      res.json({ error: error, message: "Internal server error" }).status(500);
    }
  };
};
module.exports.deleteBook = () => {
  return async (req, res) => {
    const userId = req.user;
    const list = await List.findOne({ user_id: userId });
    const bookId = mongoose.Types.ObjectId(req.params.bookId.trim());
    const selectedBook = await Book.findById(bookId);
    existingList = await List.findOneAndUpdate(
      { user_id: userId },
      {
        $pull: { bookDetails: selectedBook },
        $inc: { count: -1 },
      }
    );
  };
};
