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
  
  res.redirect("/books");
}

module.exports.index = (req, res) => {
  const sessionId = req.signedCookies.sessionId;
  let cart = db.get("sessions").find({id : sessionId}).get("cart").value();
  var data = [];
  var values = [];
  if(cart) {
    values = Object.values(cart);
    let keys = Object.keys(cart);
    var books = db.get("books").value();      
    for(let key of keys) {
      for(let book of books) {
       if(book.id == key) {
         data.push(book);
       }
      }
    }
  }
  
  var url = req.protocol+"://"+req.headers.host;
  res.render("carts/index", {
    data,
    url,
    sessionId
  });
}