module.exports.postCreate = (req, res, next) => {
  let name = req.body.name;
  let phone = req.body.phone;
  let errors = [];
  
  if(name.length > 30) {
    errors.push("Tên người dùng không được quá 30 ký tự");
  }
  if(phone.length > 15) {
    errors.push("Không phải số điện thoại");
  }
  if(!name) {
    errors.push("Name is required");
  }
  if(!phone) {
    errors.push("Phone is required");
  }
  if (errors.length) {
    res.render("users/create", {
      errors,
      value: req.body
    });
    return;
  }
  next();
}