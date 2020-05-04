var shortid = require("shortid");
var cloudinary = require("cloudinary");
var Book = require("../models/books.model");

cloudinary.config({ 
  cloud_name: 'dog99', 
  api_key: process.env.API_KEY_FILE, 
  api_secret: process.env.API_KEY_SECRET 
});

var db = require("../db");

module.exports.index = async (req, res) => {
  var url = req.protocol+"://"+req.headers.host;
  var books =  await Book.find();
  res.render("books/index", {
     books,
     url
   }); 
};
  
module.exports.view = (req, res) => {
    var id = req.params.id;
    var book = db.get("books").find({id : id}).value();
    var url = req.protocol+"://"+req.headers.host;
    res.render("books/view", {
      book,
      url
    });
};

module.exports.getCreate = (req, res) => {
  res.render("books/create");
};

module.exports.postCreate = async (req, res) => {
  const avatar = req.file.path.split("/").slice(1).join("/");
  const url = req.protocol+"://"+req.headers.host+"/"+avatar;
  await cloudinary.v2.uploader.upload(url,{
    folder: "images/coverbook",
    use_filename: true
  });
  req.body.coverUrl = avatar;
  console.log(typeof req.body.coverUrl);
  await Book.create(req.body);
  res.redirect(".");
};

module.exports.getUpdate = (req, res) => {
  var id = req.params.id;
  var url = req.protocol+"://"+req.headers.host;
  const book = db.get("books").find({id : id}).value();
  res.render("books/update", {
    book,
    url
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
  var url = req.protocol+"://"+req.headers.host;
  var matchedBooks = db.get("books").value().filter(book => {
    return book.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
  });
  res.render("books/index", {
    value: q,
    books: matchedBooks,
    url
  });
};