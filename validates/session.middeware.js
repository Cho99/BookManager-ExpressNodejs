const shortid = require("shortid");
const db = require("../db");
module.exports = (req, res, next) => {
  if(!req.signedCookies.sessionId) {
    const sessionId = shortid.generate();
    res.cookie("sessionId", sessionId, {
      signed: true           
    });
    db.get("sessions").push({
      id: sessionId
    }).write();
  }
  let id = req.signedCookies.sessionId;
  let cart = db.get("sessions").find({id : id}).get("cart").value();
 
  if(id && cart) {
    cart = Object.values(cart);
    let total = 0;
    for(let number of cart) {
      total += number;
    }
    res.locals.total = total
  } else {
    res.locals.total = 0
  }    
  next();
}
