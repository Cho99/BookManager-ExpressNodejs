const db = require("../db");
const User = require("../models/users.model");

module.exports.authLogin = (req, res, next) => {
  if(!req.signedCookies.userId) {
    res.redirect("/auth/login");
    return;
  }
  
  const user = User.findById(req.signedCookies.userId);
  if(!user) {
    res.redirect("/auth/login");
    return;
  }
  res.locals.user = user;
  next();
}

