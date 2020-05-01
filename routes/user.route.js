const express = require('express');
const multer  = require("multer");

const router = express.Router();

const controller = require("../controllers/user.controller");
const validate = require("../validates/user.validate");

var upload = multer({ dest: "./public/images/avatar" });

router.get("/", controller.index);

router.get("/create", controller.getCreate);

router.post("/create", upload.single("avatar"),
            validate.postCreate, 
            controller.postCreate
);

router.get("/view/:id", controller.view);

router.get("/update/:id", controller.getUpdate);

router.post("/update", controller.postUpdate);

router.get("/:id/delete", controller.delete);

router.get("/search", controller.search);

module.exports = router;