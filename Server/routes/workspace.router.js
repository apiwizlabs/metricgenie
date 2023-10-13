const express = require("express");
const {
  getTotalWorkspaces,
  getAllWorkspaces,
  getActiveWorkspaces,
  getInactiveWorkspaces,
  getWorkspacePlanInformation,
  getWorkspaceSeatInformation,
  getMonthlyGrowthInWorkspaces,
} = require("../controllers/workspace.controller");
const { isAuthenticated } = require("../middlewares/authentication");

const router = express.Router();

// TODO: add authentication middleware before hitting request
router.route("/").get(isAuthenticated, getAllWorkspaces);
router.route("/growth").get(isAuthenticated, getMonthlyGrowthInWorkspaces);
router.route("/total").get(isAuthenticated, getTotalWorkspaces);

router.route("/active").get(isAuthenticated, getActiveWorkspaces);
router.route("/inactive").get(isAuthenticated, getInactiveWorkspaces);
router
  .route("/planinfo/:workspaceId")
  .get(isAuthenticated, getWorkspacePlanInformation);
router
  .route("/seatsinfo/:workspaceId")
  .get(isAuthenticated, getWorkspaceSeatInformation);

module.exports = router;
