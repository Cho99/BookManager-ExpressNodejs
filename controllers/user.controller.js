var shortid = require("shortid");
const User = require("../models/users.model");
var bcrypt = require("bcrypt");
const saltRounds = 10;
var cloudinary = require("cloudinary");

cloudinary.config({ 
  cloud_name: 'dog99', 
  api_key: process.env.API_KEY_FILE, 
  api_secret: process.env.API_KEY_SECRET 
});

var db = require("../db");

module.exports.index = async (req, res) => {
  const users = await User.find();
  const url = req.protocol+"://"+req.headers.host;
  res.render("users/index", {
    users,
    url
  })
};

module.exports.view = async (req, res) => {
  var id = req.params.id;
  var url = req.protocol+"://"+req.headers.host;
  var user = await User.findById(id);
  res.render("users/view", {
    user,
    url
  });
};

module.exports.getCreate = (req, res) => {
  res.render("users/create");
};

module.exports.postCreate = async (req, res) => {
  var url = req.protocol+"://"+req.headers.host;
  await bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    req.body.id = shortid.generate();
    req.body.password = hash;
    req.body.wrongLoginCount = 0;
    req.body.avatar = req.file.path.split("/").slice(1).join("/");
    cloudinary.v2.uploader.upload(url+"/"+req.body.avatar,{
      folder: "images/avatar",
      use_filename: true 
    });
    req.body.isAdmin = false;
    User.create(req.body);
    res.redirect(".");
  })
};

module.exports.getUpdate = async (req, res) => {
  const id = req.params.id;
  const url = req.protocol+"://"+req.headers.host;
  const user = await User.findById(id);
  res.render("users/update", {
    user,
    url
  });
};

module.exports.postUpdate = async (req, res) => {
  await bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    var id = req.body.id;
    var name = req.body.name;
    var phone = req.body.phone;
    var email = req.body.email;
    var wrongLoginCount = parseInt(req.body.wrongLoginCount);
    var password = hash;
    
    User.findOneAndUpdate({id : id}, {name: name, phone: phone, email: email, password:password, wrongLoginCount: wrongLoginCount});
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




