const express = require("express");
const { isAuthenticated } = require("../middlewares/authentication");
const upload = require("../common");
const { uploadFile } = require("../controllers/FileUpload/upload.controller")
const fs = require("fs");
const util = require("util");
const Logger = require("../utils/logger");
const unlinkFile = util.promisify(fs.unlink);

const router = express.Router();

router
  .route("/single")
  .post(isAuthenticated, upload.single("file"), async (req, res) => {
    try {

      const result = await uploadFile(req.file);
      Logger.debug("S3 response", result);

      // Deleting from local if uploaded in S3 bucket
      await unlinkFile(req.file.path);

      res.send({
        success: true,
        message: "File uploaded successfully",
        data: {
            url: result.Location,
            key: result.Key
        },
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Internal Server Error",
        errorMessage: err.message,
      });
    }
  });

module.exports = router;
