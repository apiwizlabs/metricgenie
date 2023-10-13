const express = require("express")
const { getApiwizDownloads } = require("../controllers/downloads.controller")
const { isAuthenticated } = require("../middlewares/authentication")

const router = express.Router()

// router.get("/astrum")
router.route("/apiwiz").get( isAuthenticated,  getApiwizDownloads)

module.exports = router
