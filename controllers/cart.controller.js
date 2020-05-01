const db = require("../db");

module.exports.cartAdd = (req, res) => {
  const bookId = req.params.bookId;
  const sessionId = req.signedCookies.sessionId;
  
  if(!sessionId) {
    res.redirect("/");
    return;
  } 
  
  const count = db.get("sessions").find({id : sessionId}).get("cart." + bookId, 0).value();
  db.get("sessions").find({id : sessionId}).set("cart." + bookId, count + 1).write();
  console.log(db.get("sessions").value())
 
  res.redirect("/books");
}