const { default: mongoose } = require("mongoose");

const notificationSchema = mongoose.Schema({
    date: Number, //unix timestamp
    push: String,
    sub_id: String, // the id of the subscription, contains the title, message, etc.
    user_id: String
})

const notificationModel = mongoose.model("notification",notificationSchema,"notifications")

module.exports = {notificationModel}