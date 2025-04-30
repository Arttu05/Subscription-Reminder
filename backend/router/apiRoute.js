const express = require("express")
const ValidateToken = require("../middleware/tokenValidator")
const { GetUserSubscriptions, AddNewReminder, NotificationSub, GetSubscriptionById, EditSubscription, DeleteSubscriptionById, DeleteNotification } = require("../controller/apiController")
const { CheckUser } = require("../middleware/userValidate")

const apiRouter = express.Router()

//all request here must be done while logged in
apiRouter.use(ValidateToken)

apiRouter.get("/subscriptions", GetUserSubscriptions)

apiRouter.post("/add", AddNewReminder)

apiRouter.post("/notification", NotificationSub) // route where user subscripes to the notification

// NOTE :Id is subscription _id
apiRouter.delete("/notification/:id", CheckUser, DeleteNotification)

apiRouter.get("/:id", CheckUser, GetSubscriptionById)

apiRouter.post("/edit/:id", CheckUser, EditSubscription )

apiRouter.delete("/:id", CheckUser, DeleteSubscriptionById)

module.exports = apiRouter