var bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
var cloudinary = require("cloudinary");
const saltRounds = 10;


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "dogsendmail@gmail.com",
    pass: process.env.PASSWORD_MAILER
  }
});

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
  
  const mailOptions = {
    from: "no-Dog",
    to: user.email,
    subject: '[THÔNG BÁO] Bảo Mật Tài Khảon',
    html: '<h1>Hãy cẩn thận cho lần đăng nhập tiếp theo bạn còn 2 lần đăng nhập nữa</h1><p>Nếu bạn đăng nhập quá 4 lần tài khoản sẽ bị khóa</p>'
  };
  
  var numberLogin =  parseInt(user.wrongLoginCount);
  if(numberLogin == 3) {
    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  }
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