// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
var cookieParser = require('cookie-parser');

const db = require("./db");
const userRoute = require("./routes/user.route");
const bookRoute = require("./routes/book.route");
const authRoute = require("./routes/auth.route");
const cartRoute = require("./routes/cart.route");
 
const transactionRoute = require("./routes/transaction.route");
const validate = require("./validates/auth.validate");
const sessionMiddleware = require("./validates/session.middeware");

const app = express();
app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(sessionMiddleware);
app.use(express.static("public"));

app.get("/" ,(req, res) =>{
  res.render("index");
}); 

//Books
app.use("/books", bookRoute);
//Users
app.use("/users",validate.authLogin ,userRoute);
//Transactions
app.use("/transactions",transactionRoute);
//auth
app.use("/auth", authRoute);
//cart
app.use("/cart", cartRoute);
// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
