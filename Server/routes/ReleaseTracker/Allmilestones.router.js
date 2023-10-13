const express = require("express");
const {
  getAllMilestones,
} = require("../../controllers/Milestones/milestone.controller");
const { isAuthenticated } = require("../../middlewares/authentication");

const router = express.Router();

router.route("/").get(isAuthenticated, getAllMilestones);

module.exports = router;
