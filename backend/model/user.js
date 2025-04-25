const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: String,
    password_hash: String,
    subscriptions: [String]
})

const userModel = new mongoose.model("user",userSchema,"users")

module.exports = userModel