const { Schema, Types } = require("mongoose")

const ApigeeXSchema = new Schema(
  {
    _id: Types.ObjectId,
    orgName: String,
    jsonKey: String,
    environments: Array,
    cts: Number,
    createdUserName: String,
    modifiedUserName: String,
    mts: Number,
    createdBy: String,
    modifiedBy: String,
    _class: String,
  },
  { collection: "Connectors.ApigeeX.Configuration" }
);

module.exports = { ApigeeXSchema };
