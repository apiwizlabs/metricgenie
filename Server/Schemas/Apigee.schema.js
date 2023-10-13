const { Schema, Types } = require("mongoose");

const ApigeeSchema = new Schema(
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

module.exports = { ApigeeSchema }