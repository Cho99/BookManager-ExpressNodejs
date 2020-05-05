let Auth = require("../../models/auths.model");
let bcrypt = require("bcrypt");

module.exports.postLogin = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  
  let user = await Auth.findOne({email : email});
  if (!user) {
    res.json({erorr: [
      "Not exsit email"
    ]})
  }
  
  await bcrypt.compare(password, user.password, (err, result) => {
    if (result) {
        res.cookie("userId", user.id, {
          signed: true
        });
        res.json(user);
    } else {
       res.json({
        errors: [
          "Wrong password"
        ],
        value : req.body
      });
    }     
  });   
}