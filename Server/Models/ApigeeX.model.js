const { Schema, Types, model } = require("mongoose");

const apigeeXSchema = new Schema(
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

const apigeeXModel = model(
  "apigeeXConfigList",
  apigeeXSchema,
  "Connectors.ApigeeX.Configuration"
);
module.exports = { apigeeXModel };
