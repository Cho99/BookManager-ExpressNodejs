const express = require('express');
const router = express.Router();

const controller = require("../controllers/cart.controller");

router.get("/add/:bookId", controller.cartAdd);

module.exports = router;