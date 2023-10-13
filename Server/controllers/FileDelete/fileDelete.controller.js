const S3 = require("aws-sdk/clients/s3");
const fs = require("fs");
const config = require("../../config");
const Logger = require("../../utils/logger");

const bucketName = config.AWS_BUCKET_NAME;
const region = config.AWS_REGION;
const accessKeyId = config.AWS_ACCESSKEY;
const secretAccessKey = config.AWS_SECRET_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

const deleteImage = async (req, res) => {
  try {
    const fileKey = req.params.key;

    const deleteParams = {
      Key: fileKey,
      Bucket: bucketName,
    };
    s3.deleteObject(deleteParams, (err, data) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Internal Server Error",
          errorMessage: err.message,
        });
      } else {
        Logger.debug("data: ", data);
        return res.status(200).json({
          success: true,
        })
      }
    });
  } catch (err) {
    Logger.error(err)
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};



module.exports = { deleteImage };
