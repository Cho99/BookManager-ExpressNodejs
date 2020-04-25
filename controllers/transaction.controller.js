var shortid = require("shortid");
var db = require("../db");

module.exports.index = (req, res) => {
  var transactions = db.get("transactions").value();
  res.render("transactions/index", {
    transactions
  });
};
  
module.exports.getCreate = (req, res) => {
  const users = db.get("users").value();
  const books = db.get("books").value();
  res.render("transactions/create", {
    users,
    books
  });
};

module.exports.postCreate = (req, res) => {
  req.body.id = shortid.generate();
    req.body.isComplete = false;
  db.get("transactions").push(req.body).write();
  res.redirect(".");
};

module.exports.complete = (req, res) => {
  const id = req.params.id;
  db.get("transactions").find({id : id}).assign({isComplete: true}).write();
  res.redirect("back");
};