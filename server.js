// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
var cookieParser = require('cookie-parser');

const userRoute = require("./routes/user.route");
const bookRoute = require("./routes/book.route");
const transactionRoute = require("./routes/transaction.route");
const validate = require("./validates/countCookie.validate");

const app = express();
app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static("public"));

app.get("/", (req, res) =>{
  res.cookie("user-id", "Dog");
  res.render("index");
}); 

//Books
app.use("/books",validate.countCookie ,bookRoute);
//Users
app.use("/users",validate.countCookie ,userRoute);
//Transactions
app.use("/transactions",validate.countCookie ,transactionRoute);
// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
