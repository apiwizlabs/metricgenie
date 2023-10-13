const { Schema, Types, model } = require("mongoose");

const workspaceSchema = new Schema(
  {
    _id: String,
    planId: String,
    status: String,
    tenant: String,
    key: String,
    seats: Number,
    paymentSchedule: String,
    trialPeriod: String,
    isTrial: Boolean,
    subscriptionId: String,
    expiresOn: Date,
    licenceKey: String,
    ssoEnabled: Boolean,
    _class: String,
    cts: Number,
    mts: Number
  },
  { collection: "Users.Workspace.List" }
);

const workspaceModel = model(
  "workspaceModel",
  workspaceSchema,
  "Users.Workspace.List"
);

module.exports = { workspaceModel };
