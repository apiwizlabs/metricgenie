const express = require("express");
const { isAuthenticated } = require("../../middlewares/authentication");
const {
  getSprintUsers,
} = require("../../controllers/SprintUsers/users.controller");
const router = express.Router();

router.route("/").get(isAuthenticated, getSprintUsers);

module.exports = router
