const mongoose = require("mongoose")
require("dotenv").config()

const subscriptionSchema = new mongoose.Schema({
    title: String,
    message: String,
    remind_date: Number, // UNIX time
    icon: {
        type: String,
        default: `${process.env.FRONTEND_URL}/icon.svg`,
    },
    delete_after: Boolean,
    remind_again: Boolean,
    notification: Boolean // if user has set reminder 
})

const subscriptionModel = new mongoose.model("subscription",subscriptionSchema)

module.exports = subscriptionModel