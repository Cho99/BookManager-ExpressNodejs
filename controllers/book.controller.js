var shortid = require("shortid");
var cloudinary = require("cloudinary");

cloudinary.config({ 
  cloud_name: 'dog99', 
  api_key: process.env.API_KEY_FILE, 
  api_secret: process.env.API_KEY_SECRET 
});

var db = require("../db");

module.exports.index = (req, res) => {
  var books = db.get("books").value();
  var url = req.protocol+"://"+req.headers.host;
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

module.exports.postCreate = (req, res) => {
  req.body.id = shortid.generate();
  req.body.coverUrl = req.file.path.split("/").slice(1).join("/");
   var url = req.protocol+"://"+req.headers.host;
  cloudinary.v2.uploader.upload(url+"/"+req.body.coverUrl,{
    folder: "images/coverbook",
    use_filename: true
  });
  db.get("books")
    .push(req.body)
    .write();
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