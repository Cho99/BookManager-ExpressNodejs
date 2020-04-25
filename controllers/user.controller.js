var shortid = require("shortid");
var db = require("../db");

module.exports.index = (req, res) => {
  var users = db.get("users").value();
  res.render("users/index", {
    users
  });
};

module.exports.view = (req, res) => {
  var id = req.params.id;
  var user = db.get("users").find({id : id}).value();
  res.render("users/view", {
    user
  });
};

module.exports.getCreate = (req, res) => {
  res.render("users/create");
};

module.exports.postCreate = (req, res) => {
  req.body.id = shortid.generate();
  let name = req.body.name;
  let phone = req.body.phone;
  let errors = [];
  
  if(name.length > 30) {
    errors.push("Tên người dùng không được quá 30 ký tự");
  }
  if(phone.length > 15) {
    errors.push("Không phải số điện thoại");
  }
  if(!name) {
    errors.push("Name is required");
  }
  if(!phone) {
    errors.push("Phone is required");
  }
  if (errors.length) {
    res.render("users/create", {
      errors,
      value: req.body
    });
    return;
  }
  
  db.get("users").push(req.body).write();
  res.redirect(".");
};

module.exports.getUpdate = (req, res) => {
  var id = req.params.id;
  var user = db.get("users").find({id : id}).value();
  res.render("users/update", {
    user
  });
};

module.exports.postUpdate = (req, res) => {
  var id = req.body.id;
  var name = req.body.name;
  var phone = req.body.phone;
  db.get("users").find({id : id}).assign({name: name, phone: phone}).write();
  res.redirect(".");
};

module.exports.delete = (req, res) => {
  var id = req.params.id;
  db.get("users").remove({id : id}).write();
  res.redirect("back");
}

module.exports.search = (req, res) => {
  var q = req.query.q;
  var matchedUsers = db.get("users").value().filter(user => {
    return user.name.toLowerCase().indexOf(q.toLowerCase()) > -1;
  });
  res.render("users/index", {
    value: q,
    users: matchedUsers
  });
}




