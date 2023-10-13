const express = require("express");
const { isAuthenticated } = require("../../../middlewares/authentication");
const {
  addAttachmentInTask,
  getAttachmentsInTask,
  getAttachmentById,
  updateAttachmentById,
  deleteAttachment,
} = require("../../../controllers/Task/attachment.controller");
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(isAuthenticated, getAttachmentsInTask)
  .post(isAuthenticated, addAttachmentInTask);

router
  .route("/:attachmentId")
  .get(isAuthenticated, getAttachmentById)
  .put(isAuthenticated, updateAttachmentById)
  .delete(isAuthenticated, deleteAttachment);

module.exports = router;
