const express = require("express");
const {
  getSwagger2Count,
  getSwagger3Count,
  getTestsuitesCount,
  getMonitoringCount,
  getMocksCount,
  getApigeeConnectorCount,
  getKongConnectorCount,
  getApigeeXConnectorCount,
} = require("../controllers/activity.controller");
const { isAuthenticated } = require("../middlewares/authentication");
const router = express.Router();

router.route("/:workspaceId/swagger").get(isAuthenticated, getSwagger2Count);
router.route("/:workspaceId/swagger3").get(isAuthenticated, getSwagger3Count);
router
  .route("/:workspaceId/testsuite")
  .get(isAuthenticated, getTestsuitesCount);
router
  .route("/:workspaceId/monitoring")
  .get(isAuthenticated, getMonitoringCount);
router.route("/:workspaceId/mocks").get(isAuthenticated, getMocksCount);
router
  .route("/:workspaceId/apigee")
  .get(isAuthenticated, getApigeeConnectorCount);
router
  .route("/:workspaceId/apigeex")
  .get(isAuthenticated, getApigeeXConnectorCount);

router.route("/:workspaceId/kong").get(isAuthenticated, getKongConnectorCount);

module.exports = router;
