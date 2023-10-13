const { Schema, Types } = require("mongoose");

const PipelineSchema = new Schema({
  _id: {
    type: Types.ObjectId,
    auto: true,
  },
  buildUrl: {
    type: String,
    trim: true,
    required: true,
  },
});

module.exports = { PipelineSchema };
