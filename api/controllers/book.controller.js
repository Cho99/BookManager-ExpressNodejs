let Book = require("../../models/books.model");
module.exports.index = async (req, res) => {
  var books = await Book.find();
  var url = req.protocol+"://"+req.headers.host;
  res.json(books);
}