const express = require("express");
const {
  getMonthlyCountOfUsersWorkspaces,
} = require("../controllers/activity.controller");
const { isAuthenticated } = require("../middlewares/authentication");

const router = express.Router();

router.route("/workspace-users/:year").get(isAuthenticated, getMonthlyCountOfUsersWorkspaces);

module.exports = router;
