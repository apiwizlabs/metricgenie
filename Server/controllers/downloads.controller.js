const connectToDb = require("../db/db.connect");
const { downloadModel } = require("../Models/downloads.model");

const getApiwizDownloads = async (req, res) => {
  try {
    let db = await connectToDb("apiwiz");
    if (!db) {
      res.status(400).json({
        message: "DB Client not available",
      });
      return;
    }

    const allDownloads = await downloadModel.estimatedDocumentCount();

    res.status(200).json({
      success: true,
      data: allDownloads,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


module.exports = { getApiwizDownloads };
