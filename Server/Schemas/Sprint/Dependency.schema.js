const { Schema, Types } = require("mongoose");

const DependencySchema = new Schema({
  _id: {
    type: Types.ObjectId,
    auto: true,
  },
  link: {
    type: String,
    trim: true,
    required: true,
  },
});

module.exports = { DependencySchema };
