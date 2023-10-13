const { Schema, Types } = require("mongoose");

const SprintSchema = new Schema(
  {
    _id: {
      type: Types.ObjectId,
      required: [true, "Sprint id required"],
      auto: true,
    },
    name: {
      type: String,
      trim: true,
      required: [true, "Sprint name required"],
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "Sprint summary required"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Sprint description required"],
    },
    type: {
      type: String,
      enum: ["ENGINEERING", "INTERNAL"],
      default:"ENGINEERING",
    },
    startDate: {
      type: String,
      trim: true,
      required: [true, "Sprint startDate required"],
    },
    endDate: {
      type: String,
      trim: true,
      required: [true, "Sprint endDate required"],
    },
    status: {
      type: String,
      uppercase: true,
      trim: true,
      enum: ["ACTIVE", "INACTIVE"],
      required: [true, "Sprint status required"],
    },
    completionPercentage: {
      type: Number,
      default: 0,
    },
    milestones: [
      {
        type: Types.ObjectId,
        ref: "milestone",
      },
    ],
  },
  { timestamps: { createdAt: "cts", updatedAt: "mts" } }
);

module.exports = { SprintSchema };
