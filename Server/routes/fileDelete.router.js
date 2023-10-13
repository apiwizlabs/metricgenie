const express = require("express");
const { isAuthenticated } = require("../middlewares/authentication");
const {
  deleteImage
} = require("../controllers/FileDelete/fileDelete.controller");

const router = express.Router();

router.route("/images/:key").delete(isAuthenticated, deleteImage);

module.exports = router;
