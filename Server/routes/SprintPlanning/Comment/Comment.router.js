const express = require("express");
const {
  addCommentInTask,
  getCommentsOfaTask,
  getCommentById,
  updateComment,
  deleteComment,
} = require("../../../controllers/Task/comment.controller");
const { isAuthenticated } = require("../../../middlewares/authentication");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(isAuthenticated, addCommentInTask)
  .get(isAuthenticated, getCommentsOfaTask);

router
  .route("/:commentId")
  .get(isAuthenticated, getCommentById)
  .put(isAuthenticated, updateComment)
  .delete(isAuthenticated, deleteComment);

module.exports = router;
