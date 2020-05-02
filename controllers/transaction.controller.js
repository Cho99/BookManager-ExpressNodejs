let shortid = require("shortid");
let db = require("../db");

module.exports.index = (req, res) => {
  
  const page = parseInt(req.query.page) || 1;
  const perPage = 4;
  const start = (page - 1) * perPage;
  const end = page * perPage;

  const transactions = db.get("transactions").value().slice(start, end);
  const pages = Math.ceil(db.get("transactions").value().length / perPage);
  let user = db.get("users").find({id : req.signedCookies.userId}).value();
  if(user) {
     if(user.isAdmin !== true) {
      transactions = db.get("transactions").value().filter(tran => {
        return tran.userId == user.id;
      }).slice(start, end);
      pages = Math.ceil(db.get("transactions").value().filter(tran => {
        return tran.userId == user.id;
      }) / perPage);
    }
  }
 
  res.render("transactions/index", {
    transactions,
    user,
    pages,
    currentPage: page
  });
};
  
module.exports.getCreate = (req, res) => {
  const users = db.get("users").value();
  const books = db.get("books").value();
  res.render("transactions/create", {
    users,
    books
  });
};

module.exports.postCreate = (req, res) => {
  req.body.id = shortid.generate();
  req.body.isComplete = false;
  db.get("transactions").push(req.body).write();
  res.redirect("back");
};

module.exports.complete = (req, res) => {
  const id = req.params.id;
  const transactions = db.get("transactions").value();  
  let data = transactions.map(x => x.id ).find(x => x == id);
  let error = "";
  if (data == undefined) {
    error = "Không tồn tại ID";
  }
  if(error !== "") {
     res.render("transactions/index",{
      transactions,
      error
    });
  }
  db.get("transactions").find({id : id}).assign({isComplete: true}).write();
  res.redirect("back");
};