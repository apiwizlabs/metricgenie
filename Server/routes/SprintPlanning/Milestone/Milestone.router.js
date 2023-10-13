const express = require("express");
const { isAuthenticated } = require("../../../middlewares/authentication");
const {
  creatNewMilestone,
  getMilestoneOfaSprint,
  getMilestoneById,
  deleteMilestoneById,
  updateMilestoneById,
  moveMilestoneAcrossSprints,
} = require("../../../controllers/Milestones/milestone.controller");
const taskRouter = require("../Task/Task.router")

// {mergeParams: true} basically gets the params from it parent router
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(isAuthenticated, getMilestoneOfaSprint)
  .post(isAuthenticated, creatNewMilestone);

router
  .route("/:milestoneId")
  .get(isAuthenticated, getMilestoneById)
  .delete(isAuthenticated, deleteMilestoneById)
  .put(isAuthenticated, updateMilestoneById);

router
  .route("/:milestoneId/move-to-sprint/:selectedSprintId")
  .patch(isAuthenticated, moveMilestoneAcrossSprints )

router.use("/:milestoneId/tasks", taskRouter)

module.exports = router;
