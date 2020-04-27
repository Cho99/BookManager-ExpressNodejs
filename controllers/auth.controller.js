var bcrypt = require("bcrypt");
const saltRounds = 10;
var db = require("../db");

module.exports.login = (req, res) => {
  res.render("auth/login");
};

module.exports.postLogin = (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

  var user = db.get("users").find({email : email}).value();
  if(!user) {
  res.render("auth/login", {
    errors: [
      "USer is not exist"
    ],
    value : req.body
  });
  }
  
  var numberLogin =  user.wrongLoginCount;
  if(numberLogin > 4) {
    res.render("auth/login", {
        errors: [
          "Quá số lần đăng nhập"
        ],
        value : req.body
    });
    return;
  }
   

  
  bcrypt.compare(req.body.password, user.password, (err, result) => {
    if (result) {
        res.cookie("userId", user.id, {
          signed: true
        });
        res.redirect("/");
    } else {
       numberLogin = numberLogin + 1;
       db.get("users").find({email : email}).assign({wrongLoginCount : numberLogin}).write();
       res.render("auth/login", {
        errors: [
          "Wrong password"
        ],
        value : req.body
      });
    }     
  });
  
}