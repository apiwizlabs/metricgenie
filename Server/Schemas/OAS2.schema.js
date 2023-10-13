const { Schema, Types } = require("mongoose");

const OAS2Schema = new Schema(
  {
    _id: Types.ObjectId,
    revision: Number,
    status: String,
    swaggerId: String,
    name: String,
    lock: Boolean,
    lockedBy: String,
    lockedAt: Number,
    lockedByUserId: String,
    swagger: String,
    cts: Number,
    createdUserName: String,
    modifiedUserName: String,
    mts: Number,
    createdBy: String,
    modifiedBy: String,
    interactionid: String,
    jsessionid: String,
    _class: String,
  },
  { collection: "Design.Swagger.List" }
);

module.exports = { OAS2Schema };
