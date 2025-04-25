const express = require("express")
const ValidateToken = require("../middleware/tokenValidator")
const { GetUserSubscriptions, AddNewReminder, NotificationSub } = require("../controller/apiController")

const apiRouter = express.Router()

//all request here must be done while logged in
apiRouter.use(ValidateToken)

apiRouter.get("/subscriptions", GetUserSubscriptions)
apiRouter.post("/add", AddNewReminder)
apiRouter.post("/notification", NotificationSub) // route where user subscripes to the notification

module.exports = apiRouter