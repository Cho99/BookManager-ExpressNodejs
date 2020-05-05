var shortid = require("shortid");
var cloudinary = require("cloudinary");
const Book = require("../models/books.model");

cloudinary.config({ 
  cloud_name: 'dog99', 
  api_key: process.env.API_KEY_FILE, 
  api_secret: process.env.API_KEY_SECRET 
});

var db = require("../db");

module.exports.index = async (req, res, next) => {

  try {
    var url = req.protocol+"://"+req.headers.host;
    var books =  await Book.find();
    var a; a.b();
    res.render("books/index", {
       books,
       url
     }); 
  } catch (error) {
    res.render("error", {error});
  }
};
  
module.exports.view = async (req, res) => {
    const id = req.params.id;
    const url = req.protocol+"://"+req.headers.host;
    console.log(id);
    const book = await Book.findById(id);
    console.log(book);
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
  await Book.create(req.body);
  res.redirect(".");
};

module.exports.getUpdate = async (req, res) => {
  const id = req.params.id;
  const url = req.protocol+"://"+req.headers.host;
  const book = await Book.findById(id);
  res.render("books/update", {
    book,
    url
  });
};

module.exports.postUpdate = async (req, res) => {
  const id = req.body.id;
  const name = req.body.name;
  const description = req.body.description;
  const coverUrl = req.file.path.split("/").slice(1).join("/");
  
  await Book.findOneAndUpdate({_id : id}, {
    name,
    description,
    coverUrl
  })
  
  res.redirect(".");
};

module.exports.delete = async (req, res) => {
  var id = req.params.id;
  await Book.findByIdAndDelete(id)
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