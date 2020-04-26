var db = require("../db");

module.exports.countCookie = (req, res, next) => {
  if (!req.cookie) {
   var cookie = req.cookies;
   db.update("count", n => n + 1).write();
   var number = db.get("count").value();
   cookie = JSON.stringify(cookie);
   console.log(cookie+ ": " + number);
    
  } else {
    db.update("count", n => n = 0);
  }
  next();
}