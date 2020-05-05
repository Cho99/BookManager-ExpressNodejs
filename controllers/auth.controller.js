var Auth = require("../models/auths.model");
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

module.exports.postLogin = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await Auth.findOne({email: email});
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
  
  const numberLogin =  parseInt(user.wrongLoginCount);
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
   

  
  await bcrypt.compare(req.body.password, user.password, (err, result) => {
    if (result) {
        res.cookie("userId", user.id, {
          signed: true
        });
        res.redirect("/users");
    } else {
       numberLogin = numberLogin + 1;
       Auth.findOneAndUpdate({email: email}, {wrongLoginCount : numberLogin});
       res.render("auth/login", {
        errors: [
          "Wrong password"
        ],
        value : req.body
      });
    }     
  });
  
}