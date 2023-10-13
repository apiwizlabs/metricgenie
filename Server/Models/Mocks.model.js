const { Schema, Types, model } = require("mongoose");

const mocksSchema = new Schema(
  {
    _id: Types.ObjectId,
    name: String,
    description: String,
    summary: String,
    groupId: String,
    scenarioName: String,
    request: Object,
    response: Object,
    pathArray: Array,
    mts: Number,
    modifiedBy: String,
    _class: String,
  },
  { collection: "Mock.Expectation.List" }
);

const mockModel = model("mockList", mocksSchema, "Mock.Expectation.List");
module.exports = { mockModel };
