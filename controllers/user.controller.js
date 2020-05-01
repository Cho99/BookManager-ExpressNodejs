var shortid = require("shortid");
var bcrypt = require("bcrypt");
const saltRounds = 10;
var cloudinary = require("cloudinary");

cloudinary.config({ 
  cloud_name: 'dog99', 
  api_key: process.env.API_KEY_FILE, 
  api_secret: process.env.API_KEY_SECRET 
});

var db = require("../db");

module.exports.index = (req, res) => {
  var users = db.get("users").value();
  var url = req.protocol+"://"+req.headers.host;
  res.render("users/index", {
    users,
    url
  });
};

module.exports.view = (req, res) => {
  var id = req.params.id;
  var user = db.get("users").find({id : id}).value();
  var url = req.protocol+"://"+req.headers.host;
  res.render("users/view", {
    user,
    url
  });
};

module.exports.getCreate = (req, res) => {
  res.render("users/create");
};

module.exports.postCreate = (req, res) => {
  var url = req.protocol+"://"+req.headers.host;
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    req.body.id = shortid.generate();
    req.body.password = hash;
    req.body.wrongLoginCount = 0;
    req.body.avatar = req.file.path.split("/").slice(1).join("/");
    cloudinary.v2.uploader.upload(url+"/"+req.body.avatar,{
      folder: "images/avatar",
      use_filename: true 
    });
    req.body.isAdmin = false;
    db.get("users").push(req.body).write(); 
    res.redirect(".");
  })
};

module.exports.getUpdate = (req, res) => {
  var id = req.params.id;
  var user = db.get("users").find({id : id}).value();
  var url = req.protocol+"://"+req.headers.host;
  res.render("users/update", {
    user,
    url
  });
};

module.exports.postUpdate = (req, res) => {
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    var id = req.body.id;
    var name = req.body.name;
    var phone = req.body.phone;
    var email = req.body.email;
    var wrongLoginCount = parseInt(req.body.wrongLoginCount);
    var password = hash;
    db.get("users").find({id : id}).assign({name: name, phone: phone, email: email, password:password, wrongLoginCount: wrongLoginCount}).write();
    res.redirect(".");
  })
};

module.exports.delete = (req, res) => {
  var id = req.params.id;
  db.get("users").remove({id : id}).write();
  res.redirect("back");
}

module.exports.search = (req, res) => {
  var q = req.query.q;
  var url = req.protocol+"://"+req.headers.host;
  var matchedUsers = db.get("users").value().filter(user => {
    return user.name.toLowerCase().indexOf(q.toLowerCase()) > -1;
  });
  res.render("users/index", {
    value: q,
    users: matchedUsers,
    url
  });
}




