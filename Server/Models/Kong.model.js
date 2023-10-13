const { Schema, Types, model } = require("mongoose");

const KongSchema = new Schema(
  {
    _id: Types.ObjectId,
    name: String,
    kongAdminToken: String,
    kongAdminHost: String,
    tier: String,
    type: String,
    _class: String,
  },
  { collection: "Connectors.Kong.Runtime.List" }
);

const kongModel = model(
  "kongConnectorsList",
  KongSchema,
  "Connectors.Kong.Runtime.List"
);

module.exports = { kongModel }