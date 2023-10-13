const { Schema, Types } = require("mongoose");

const ReleaseSchema = new Schema(
  {
    _id: {
      type: Types.ObjectId,
      auto: true,
      required: true,
    },
    name: {
      type: String,
      required: [true, "Release name is required"],
    },
    description: {
        type: String,
        required: [true, "Release description is required"],
    },
    startDate: {
      type: String,
      trim: true,
      required: [true, "Sprint startDate required"],
    },
    releaseDate: {
      type: String,
      trim: true,
      required: [true, "Sprint endDate required"],
    },
    milestones: [
      {
        type: Types.ObjectId,
        ref: "milestone",
      },
    ],
    tasks: [
      {
        type: Types.ObjectId,
        ref: "task"
      }
    ]
  },
  { timestamps: { createdAt: "cts", updatedAt: "mts" } }
);

module.exports = { ReleaseSchema };
