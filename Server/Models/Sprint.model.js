const { model } = require("mongoose");
const { SprintSchema } = require("../Schemas/Sprint/Sprint.schema");

const SprintModel = model("sprint", SprintSchema);
module.exports = { SprintModel };
