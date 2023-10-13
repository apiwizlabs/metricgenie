const { Schema, Types } = require("mongoose");
const { AttachmentSchema } = require("../Sprint/attachment.schema");

const BugSchema = new Schema(
  {
    _id: {
      type: Types.ObjectId,
      auto: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    owner: {
      type: String,
      required: true,
    },
    ownerEmail: {
      type: String,
      required: [true, "Bug owner Email required"],
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
      required: [true, "Bug status required"],
    },
    priority: {
      type: String,
      uppercase: true,
      enum: ["URGENT", "HIGH", "MEDIUM", "LOW"],
    },
    reportedBy: {
      type: String,
      required: true,
    },
    reportedByEmail: {
      type: String,
      required: [true, "Bug Reporter Email required"],
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
    attachments: {
      type: [AttachmentSchema],
      default: [],
    },
    tags: {
      sprintId: { type: String, default: "" },
      sprintName: { type: String, default: "" },
      milestoneId: { type: String, default: "" },
      milestoneName: { type: String, default: "" },
      taskName: { type: String, default: "" },
      taskId: { type: String, default: "" },
      releaseId: { type: String, default: "" },
      releaseName: { type: String, default: "" },
    },
  },
  { timestamps: { createdAt: "cts", updatedAt: "mts" } }
);

module.exports = { BugSchema };
