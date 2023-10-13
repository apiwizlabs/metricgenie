const { Schema, Types, model } = require("mongoose");

const TestSuiteSchema = new Schema(
  {
    _id: Types.ObjectId,
    name: String,
    description: String,
    scenarios: Array,
    successRate: Number,
    active: Boolean,
    duration: Number,
    successRatio: Number,
    executionStatus: String,
    cts: Number,
    createdUserName: String,
    modifiedUserName: String,
    mts: Number,
    createdBy: String,
    modifiedBy: String,
    _class: String,
  },
  { collection: "Test.Collections.List" }
);

const TestSuitemodel = model(
  "TestSuiteList",
  TestSuiteSchema,
  "Test.Collections.List"
);
module.exports = { TestSuitemodel };
