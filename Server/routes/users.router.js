const express = require("express");
const {
  getUsersCount,
  getUsersByWorkspace,
  getAllUsers,
  getMonthlyGrowthOfUsers,
} = require("../controllers/users.controller");
const { isAuthenticated } = require("../middlewares/authentication");

const router = express.Router();

router.route("/").get(isAuthenticated, getAllUsers);
router.route("/growth").get(isAuthenticated, getMonthlyGrowthOfUsers);
router.route("/total").get(isAuthenticated, getUsersCount);
router
  .route("/workspace/:workspaceId")
  .get(isAuthenticated, getUsersByWorkspace);

module.exports = router;
