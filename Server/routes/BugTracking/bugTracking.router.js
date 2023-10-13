const express = require("express");
const { isAuthenticated } = require("../../middlewares/authentication");
const {
  createNewBug,
  addAttachmentInBug,
  getAttachmentsInBug,
  getAllBugs,
  getBugById,
  updateBug,
  deleteBug,
  deleteAttachmentInBug,
} = require("../../controllers/Bugtracking/bugTracking.controller");

const router = express.Router();

router
  .route("/")
  .post(isAuthenticated, createNewBug)
  .get(isAuthenticated, getAllBugs);

router
  .route("/:bugId")
  .get(isAuthenticated, getBugById)
  .put(isAuthenticated, updateBug)
  .delete(isAuthenticated, deleteBug);

router
  .route("/:bugId/attachments")
  .get(isAuthenticated, getAttachmentsInBug)
  .post(isAuthenticated, addAttachmentInBug);

router
  .route("/:bugId/attachments/:attachmentId")
  .delete(isAuthenticated, deleteAttachmentInBug);

module.exports = router;
