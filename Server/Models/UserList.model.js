const { Schema, Types, model } = require("mongoose")

const UserlistSchema = new Schema({
    _id: Types.ObjectId,
    loginId: String,
    email: String,
    password: String,
    lastName: String,
    firstName: String,
    userStatus: String,
    workspaces: Array,
    userCount: Number,
    cts: Number,
    mts: Number
}, { collection: "Users.List"})

const usersListModel = model("userlist", UserlistSchema, "Users.List")
module.exports = { usersListModel }