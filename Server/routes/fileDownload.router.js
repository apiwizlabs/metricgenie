const express = require("express");
const { isAuthenticated } = require("../middlewares/authentication");
const {
  downloadImage
} = require("../controllers/FileDownload/download.controller");

const router = express.Router();

router.route("/images/:key").get(isAuthenticated, downloadImage);

module.exports = router;
