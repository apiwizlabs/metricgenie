const { Schema, model, Types } = require("mongoose");

const downloadSchema = new Schema(
  {
    _id: Types.ObjectId,
    name: String,
    platform: String,
    ip: String,
    details: Object,
    _class: String,
  },
  { collection: "appDownloadModel" }
);

const downloadModel = model(
  "download",
  downloadSchema,
  "appDownloadModel"
);

module.exports = { downloadModel };
