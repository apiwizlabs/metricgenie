const { Schema, Types } = require("mongoose");
const { SourceControlSchema } = require("./SourceControl.schema");
const { PipelineSchema } = require("./Pipeline.schema");
const { DependencySchema } = require("./Dependency.schema");
const { CommentsSchema } = require("./Comments.schema");
const { AttachmentSchema } = require("./attachment.schema");

const TaskSchema = new Schema(
  {
    _id: {
      type: Types.ObjectId,
      required: true,
      auto: true,
    },
    parentTaskId: {
      type: Types.ObjectId,
      default: null
    },
    name: {
      type: String,
      trim: true,
      required: [true, "Task name required"],
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "Task summary required"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Task description required"],
    },
    owner: {
      type: String,
      trim: true,
      required: [true, "Task owner required"],
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
    assignee: {
      type: String,
      trim: true,
      required: [true, "Task assignee required"],
    },
    assigneeEmail: {
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
    startDate: {
      type: String,
      trim: true,
      required: [true, "Task startdate required"],
    },
    endDate: {
      type: String,
      trim: true,
      required: [true, "Task endDate required"],
    },
    type: {
      type: String,
      required: [true, "Task type is required"],
      uppercase: true,
      trim: true,
      enum: [
        "DESIGN",
        "BACKEND",
        "FRONTEND",
        "QA",
        "OPERATIONS",
        "CONFIGURATION",
        "MISCELLANEOUS",
      ],
    },
    priority: {
      type: String,
      trim: true,
      uppercase: true,
      required: [true, "Task priority required"],
      enum: ["URGENT", "HIGH", "MEDIUM", "LOW"],
    },
    status: {
      type: String,
      trim: true,
      uppercase: true,
      required: [true, "Task status required"],
      enum: [
        "READY",
        "IN PROGRESS",
        "CODE REVIEW",
        "TESTING",
        "READY FOR RELEASE",
        "IN PROD",
        "DONE",
        "REJECT"
      ],
    },
    estimatedEffort: {
      type: Number,
      required: [true, "Estimated effort required"],
      default: 0,
    },
    effortSpent: {
      type: Number,
      default: 0,
    },
    worklog: {
      type: Map, // Worklog for Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday
      of: Number,
      default: {
        Monday: 0,
        Tuesday: 0,
        Wednesday: 0,
        Thursday: 0,
        Friday: 0,
        Saturday: 0,
        Sunday: 0,
      },
    },
    rfcTemplate: {
      type: String,
      default: ""
    },
    subTasks: [
      {
        type: Types.ObjectId,
        ref: "task"
      }
    ],
    rfcTemplate: {
      type: String,
      default: ""
    },
    document: {
      type: Object,
      default: {}
    },
    sourceControl: {
      type: [SourceControlSchema],
      default: [],
    },
    pipeline: {
      type: [PipelineSchema],
      default: [],
    },
    dependency: {
      type: [DependencySchema],
      default: [],
    },
    comments: {
      type: [CommentsSchema],
      default: [],
    },
    attachments: {
      type: [AttachmentSchema],
      default: [],
    },
    releaseInfo: {
      releaseName: {
        type: String
      },
      releaseDate: {
        type: String
      },
      releaseId: {
        type: Types.ObjectId
      }
    }
  },
  { timestamps: { createdAt: "cts", updatedAt: "mts" } }
);

module.exports = { TaskSchema };
