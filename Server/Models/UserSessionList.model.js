const { Schema, Types, model } = require("mongoose")

const UserSessionList = new Schema({
    _id: Types.ObjectId,
    userId: String,
    username: String,
    ipAddress: String,
    host: String,
    userAgent: String,
    loginTimestamp: Number,
    expired: Boolean,
    email: String,
    roles: Array,
    loginId: String,
    lastName: String,
    firstName: String,
    userStatus: String,
    status: String,
    userType: String,
    tenant: String,
    workspaceId: String,
    isTrial: Boolean,
    planId: String,
    paymentSchedule: String,
    subscriptionId: String,
    _class: String
}, { collection: "Users.Sessions.List"})

const userSessionListModel = model("userSessionList", UserSessionList, "Users.Sessions.List")

module.exports = { userSessionListModel }
