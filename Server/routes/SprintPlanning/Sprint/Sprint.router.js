const express = require("express");
const {
  getAllSprints,
  createNewSprint,
  getSprintById,
  updateSprintById,
  deleteSprintById,
} = require("../../../controllers/Sprint/sprint.controller");
const { isAuthenticated } = require("../../../middlewares/authentication");
const milestoneRouter = require("../Milestone/Milestone.router");

const router = express.Router();

router
  .route("/")
  .get(isAuthenticated, getAllSprints)
  .post(isAuthenticated, createNewSprint);

router
  .route("/:sprintId")
  .get(isAuthenticated, getSprintById)
  .put(isAuthenticated, updateSprintById)
  .delete(isAuthenticated, deleteSprintById);

router.use("/:sprintId/milestones", milestoneRouter);

module.exports = router;
