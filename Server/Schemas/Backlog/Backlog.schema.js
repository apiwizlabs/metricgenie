const { Types, Schema } = require("mongoose");
const { AttachmentSchema } = require("../Sprint/attachment.schema");
const { CommentsSchema } = require("../Sprint/Comments.schema");

const BacklogSchema = new Schema(
  {
    _id: {
      type: Types.ObjectId,
      required: true,
      auto: true,
    },
    name: {
      type: String,
      rtrim: true,
      required: [true, "Backlog name is required"],
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "Backlog summary is required"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Backlog description is required"],
    },
    type: {
      type: String,
      required: [true, "Backlog type is required"],
      uppercase: true,
      trim: true,
      enum: ["BACKLOG"],
    },
    status: {
      type: String,
      trim: true,
      uppercase: true,
      required: [true, "Task status required"],
      enum: ["BACKLOG"],
    },
    comments: {
        type: [CommentsSchema],
        default: []
    },
    attachments: {
        type: [AttachmentSchema],
        default: []
    }
  },
  { timestamps: { createdAt: "cts", updatedAt: "mts" } }
);

module.exports = { BacklogSchema };
