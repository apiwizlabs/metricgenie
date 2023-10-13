const { Schema, Types } = require("mongoose");

const AttachmentSchema = new Schema({
  _id: {
    type: Types.ObjectId,
    auto: true,
    required: true,
  },
  name: {
    type: String,
    trim: true,
  },
  summary: {
    type: String,
    trim: true,
  },
  docLink: {
    type: String,
    trim: true,
  },
  fileKey: {
    type: String,
    trim: true,
  },
  owner: {
    type: String,
    trim: true,
    required: [true, "Attachment owner required"],
  },
  ownerEmail: {
    type: String,
    required: [true, "Attachment owner Email required"],
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

AttachmentSchema.pre('validate', function(next) {
  if((this.fileKey && this.docLink) || (!this.fileKey && !this.docLink))
        return next(new Error("At least and Only one field(doclink, filekey) should be populated"))
  next()
});

module.exports = { AttachmentSchema };
