const mongoose = require("mongoose");

const authSchema = new mongoose.Schema({
  name: String,
  avatar: String,
  phone: String,
  email : String,
  password : String,
  isAdmin: Boolean,
  wrongLoginCount: Number
});

const Auth = mongoose.model("Auth", authSchema, "users");

module.exports = Auth;
