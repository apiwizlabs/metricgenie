const { Schema, Types, model } = require("mongoose");

const OAS3Schema = new Schema(
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
  { collection: "Design.Swagger3.List" }
);

const OAS3Model = model("OAS3List", OAS3Schema, "Design.Swagger3.List");
module.exports = { OAS3Model };
