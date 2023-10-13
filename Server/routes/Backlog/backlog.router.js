const express = require("express");
const { isAuthenticated } = require("../../middlewares/authentication");
const {
  createNewBacklog,
  deleteBacklog,
  getAllBacklogs,
  getBacklogById,
  updateBacklog,
  addComment,
  getAllComments,
  getCommentById,
  deleteComment,
  updateComment,
  addAttachment,
  deleteAttachment,
  getAttachmentById,
  getAttachmentsInBacklog,
  updateAttachmentBydId,
} = require("../../controllers/Backlog/backlog.controller");
const router = express.Router();

router
  .route("/")
  .get(isAuthenticated, getAllBacklogs)
  .post(isAuthenticated, createNewBacklog);

router
  .route("/:backlogId")
  .get(isAuthenticated, getBacklogById)
  .put(isAuthenticated, updateBacklog)
  .delete(isAuthenticated, deleteBacklog);

router
  .route("/:backlogId/comments")
  .get(isAuthenticated, getAllComments)
  .post(isAuthenticated, addComment);

router
  .route("/:backlogId/comments/:commentId")
  .get(isAuthenticated, getCommentById)
  .put(isAuthenticated, updateComment)
  .delete(isAuthenticated, deleteComment);

router
  .route("/:backlogId/attachments")
  .get(isAuthenticated, getAttachmentsInBacklog)
  .post(isAuthenticated, addAttachment);

router
  .route("/:backlogId/attachments/:attachmentId")
  .get(isAuthenticated, getAttachmentById)
  .put(isAuthenticated, updateAttachmentBydId)
  .delete(isAuthenticated, deleteAttachment);

module.exports = router;
