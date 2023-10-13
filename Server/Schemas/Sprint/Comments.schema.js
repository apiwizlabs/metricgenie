const { Schema, Types } = require("mongoose");

const CommentsSchema = new Schema({
  _id: {
    type: Types.ObjectId,
    required: true,
    auto: true,
  },
  message: {
    type: String,
    trim: true,
    required: [true, "Comment message required"],
  },
  owner: {
    type: String,
    trim: true,
    required: [true, "Comment owner required"],
  },
  ownerEmail: {
    type: String,
    required: [true, "Comment owner Email required"],
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
});

module.exports = { CommentsSchema }
