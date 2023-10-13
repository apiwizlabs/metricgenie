const { Schema, Types, model } = require("mongoose");

const apigeeSchema = new Schema(
  {
    _id: Types.ObjectId,
    port: String,
    orgname: String,
    hostname: String,
    type: String,
    scheme: String,
    environments: Array,
    apigeeServiceUser: Array,
    cts: Number,
    createdUserName: String,
    modifiedUserName: String,
    mts: Number,
    createdBy: String,
    modifiedBy: String,
    _class: String,
  },
  { collection: "Connectors.Apigee.Configuration" }
);

const apigeeModel = model(
  "apigeeConfigList",
  apigeeSchema,
  "Connectors.Apigee.Configuration"
);

module.exports = { apigeeModel }