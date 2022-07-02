const { List } = require("../models/readListModel");
const lodash = require("lodash");
const { Book } = require("../models/bookModel");
const mongoose = require('mongoose')

module.exports.createList = (req, res, next) => {
  return async (req, res) => {
    const id = req.user;
    console.log(req.params.bookId);
    const bookId = mongoose.Types.ObjectId(req.params.bookId.trim());
    const requestBody = lodash.pick(req.body, ["bookName"]);
    let existingList = await List.findOne({ userId: id });
    const selectedBook = await Book.findById(bookId);
    return console.log(selectedBook);
    // if (!existingList) {
      newList = new List({
        user_id: id,
        bookDetails: selectedBook,
      });
      await newList.save().then(() => {
        return res.status(200).send("List created successfully");
      });
    // } else {
    //   existingList = List.findOneAndUpdate(
    //     { userId: id },
    //     {
    //       $push: { bookDetails: selectedBook },
    //       $inc: { count: 1 },
    //     }
    //   );
    //   res.json(existingList);
    // }
    res.json(req.user)
  };
};
module.exports.getList = async (req, res) => {
  try {
    const userId = req.params.Id;
    const list = List.findOne({ _id: userId });

    if (List) {
      return res.json({ status: oK, List: list }).status(200);
    } else {
      return res
        .json({ status: OK, message: "no existing list, create new" })
        .status(200);
    }
  } catch (error) {
    res.json({ error: error, message: "Internal server error" }).status(500);
  }
};
