var db = require("../db");

module.exports.countCookie = (req, res, next) => {
  if (!req.cookie) {
   db.update('count', n => n + 1)
  .write();
  }
  var number = db.get("count").value();
  var cookie = req.cookies
  console.log(cookie +": " +number);
  next();
}