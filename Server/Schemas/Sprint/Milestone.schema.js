const { Schema, Types } = require("mongoose");

const MilestoneSchema = new Schema(
  {
    _id: {
      type: Types.ObjectId,
      required: [true, "Milestone id required"],
      auto: true,
    },
    name: {
      type: String,
      trim: true,
      requried: [true, "Milestone name required"],
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "Summary required"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Milestone description required"],
    },
    owner: {
      type: String,
      trim: true,
      required: [true, "owner required"],
    },
    ownerEmail: {
      type: String,
      required: [true, "Email required"],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (email) {
          const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
          return emailRegex.test(email);
        },
        message: "Please Enter a valid email",
      },
    },
    status: {
      type: String,
      uppercase: true,
      enum: ["ACTIVE", "BACKLOG", "DEV", "QA", "PROD"],
      required: [true, "Sprint status required"],
    },
    tasksDoneCount: {
      type: Number,
      default: 0,
    },
    tasks: [
      {
        type: Types.ObjectId,
        ref: "task",
      },
    ],
    // milestone can be part of multiple releases
    releaseInfo: [
      {
        releaseName: {
          type: String,
        },
        releaseDate: {
          type: String,
        },
        releaseId: {
          type: Types.ObjectId,
        },
        _id: {
          type: Types.ObjectId,
          auto: true,
        },
      },
    ],
  },
  { timestamps: { createdAt: "cts", updatedAt: "mts" } }
);

module.exports = { MilestoneSchema };
