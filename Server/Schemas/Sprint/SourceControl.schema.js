const { Schema, Types } = require("mongoose");

const SourceControlSchema = new Schema({
  _id: {
    type: Types.ObjectId,
    auto: true,
  },
  repoName: {
    type: String,
    trim: true,
    required: true,
  },
  branchName: {
    type: String,
    trim: true,
    required: true,
  },
  link: {
    type: String,
    trim: true,
    required: true,
  },
});

module.exports = { SourceControlSchema };
