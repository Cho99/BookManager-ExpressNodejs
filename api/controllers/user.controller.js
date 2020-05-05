const User = require("../../models/users.model");

module.exports.index = async(req, res) => {
  var user = await User.find();
  res.json(user);
}