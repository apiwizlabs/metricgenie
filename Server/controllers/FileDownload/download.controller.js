const S3 = require("aws-sdk/clients/s3");
const fs = require("fs");
const config = require("../../config");
const path = require("path");
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

const downloadImage = async (req, res) => {
  try {
    const fileKey = req.params.key;
    const filePath = path.join(fileKey);

    const downloadParams = {
      Key: fileKey,
      Bucket: bucketName,
    };

    return s3.getObject(downloadParams, (err, data) => {
      if (err) {
        Logger.error(`s3 download err: ${JSON.stringify(err)}`)
        return res.status(500).json({
          success: false,
          message: "Error in downloading file"
        })
      };
      fs.writeFileSync(filePath, data.Body);
      Logger.debug(`${filePath} has been created!`);

      res.download(filePath, function (err) {
        if (err) {

          Logger.error(res.headersSent)
          return res.status(500).json({
            success: false,
            message: "Error in downloading file"
          })
        } else {
          fs.unlink(filePath, function (err) {
              if (err) {
                  console.error(err);
                  return res.status(500).json({
                    success: false,
                    message: "Error in downloading file"
                  })
              }
              Logger.debug('Temp File Delete');
          });
        }
      })
    });
  } catch (err) {
    Logger.error(err)
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      errorMessage: err.message,
    });
  }
};

module.exports = { downloadImage };
