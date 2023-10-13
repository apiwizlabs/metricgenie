const { Schema, Types } = require("mongoose");

const UserSchema = new Schema(
  {
    _id: {
      type: Types.ObjectId,
      required: true,
      auto: true,
    },
    name: {
      type: String,
      trim: true,
      required: [true, "User name required"],
    },
    email: {
      type: String,
      required: [true, "Attachment owner Email required"],
      unique: true,
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
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: { createdAt: "cts", updatedAt: "mts" },
    collection: "users.list",
  }
);

module.exports = { UserSchema };
