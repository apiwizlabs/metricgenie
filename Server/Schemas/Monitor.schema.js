const { Schema, Types } = require("mongoose");

const MonitorSchema = new Schema(
  {
    _id: Types.ObjectId,
    name: String,
    summary: String,
    description: String,
    notifications: Array,
    schedulers: Array,
    monitorRequest: Array,
    cts: Number,
    createdUserName: String,
    modifiedUserName: String,
    mts: Number,
    createdBy: String,
    modifiedBy: String,
    _class: String,
    sequence: Array,
  },
  { collection: "Monitor.Collections.List" }
);


module.exports = { MonitorSchema };
