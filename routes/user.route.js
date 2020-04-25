const express = require('express');
const router = express.Router();

const controller = require("../controllers/user.controller");

router.get("/", controller.index);

router.get("/create", controller.getCreate);

router.post("/create", controller.postCreate);

router.get("/view/:id", controller.view);

router.get("/update/:id", controller.getUpdate);

router.post("/update", controller.postUpdate);

router.get("/:id/delete", controller.delete);

router.get("/search", controller.search);

module.exports = router;