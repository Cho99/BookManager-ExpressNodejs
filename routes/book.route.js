const express = require('express');
const multer  = require("multer");
const router = express.Router();

const controller = require("../controllers/book.controller");

var upload = multer({ dest: "./public/images/cover_book" });

router.get("/", controller.index);

router.get("/create", controller.getCreate);

router.post("/create", upload.single("coverBook"), controller.postCreate);

router.get("/view/:id", controller.view);

router.get("/update/:id", controller.getUpdate);

router.post("/update", controller.postUpdate);

router.get("/:id/delete", controller.delete);

router.get("/search", controller.search);

module.exports = router;