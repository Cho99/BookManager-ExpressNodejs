var shortid = require("shortid");
var db = require("../db");

module.exports.index = (req, res) => {
  var books = db.get("books").value();
  res.render("books/index", {
    books
  });
};
  
module.exports.view = (req, res) => {
    var id = req.params.id;
    var book = db.get("books").find({id : id}).value();
    res.render("books/view", {
      book
    });
};

module.exports.getCreate = (req, res) => {
  res.render("books/create");
};

module.exports.postCreate = (req, res) => {
  req.body.id = shortid.generate();
  db.get("books")
    .push(req.body)
    .write();
  res.redirect(".");
};

module.exports.getUpdate = (req, res) => {
  var id = req.params.id;
  const book = db.get("books").find({id : id}).value();
  res.render("books/update", {
    book
  });
};

module.exports.postUpdate = (req, res) => {
  const id = req.body.id;
  const name = req.body.name;
  const description = req.body.description;
  db.get("books")
    .find({id : id})
    .assign({
      name:name, description : description})
    .write();
  res.redirect(".");
};

module.exports.delete = (req, res) => {
  var id = req.params.id;
  db.get("books").remove({id : id}).write();
  res.redirect("back");
};

module.exports.search = (req, res) => {
  var q = req.query.q;
  var matchedBooks = db.get("books").value().filter(book => {
    return book.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
  });
  res.render("books/index", {
    value: q,
    books: matchedBooks
  });
};