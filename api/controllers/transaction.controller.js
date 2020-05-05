const Transaction = require("../../models/transactions.model");
const User = require("../../models/users.model");
module.exports.index = async (req, res) => {
  const id = req.signedCookies.userId;
  const user = await User.findById(id);
  var transactions = await Transaction.find();
  
  if(!user.isAdmin) {
    transactions = await Transaction.find({userId : id});
  }

  res.json(transactions);
};
  
