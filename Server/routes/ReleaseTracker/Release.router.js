const express = require("express");
const { isAuthenticated } = require("../../middlewares/authentication");
const {
  getReleases,
  createNewRelease,
  getReleaseById,
  addTasksToRelease,
  deleteTaskFromRelease,
  updateReleaseById,
  deleteRelease
} = require("../../controllers/ReleaseTracker/Release.controller");
const router = express.Router();

router
  .route("/")
  .get(isAuthenticated, getReleases)
  .post(isAuthenticated, createNewRelease);

router
  .route("/:releaseId")
  .get(isAuthenticated, getReleaseById)
  .post(isAuthenticated, addTasksToRelease)
  .put(isAuthenticated, updateReleaseById)
  .delete(isAuthenticated, deleteRelease)

  router
  .route("/:releaseId/:taskId")
  .delete(isAuthenticated, deleteTaskFromRelease);

module.exports = router;