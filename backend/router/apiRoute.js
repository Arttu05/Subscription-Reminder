const express = require("express")
const ValidateToken = require("../middleware/tokenValidator")
const { GetUserSubscriptions, AddNewReminder, NotificationSub, GetSubscriptionById, EditSubscription } = require("../controller/apiController")
const { CheckUser } = require("../middleware/userValidate")

const apiRouter = express.Router()

//all request here must be done while logged in
apiRouter.use(ValidateToken)

apiRouter.get("/subscriptions", GetUserSubscriptions)

apiRouter.post("/add", AddNewReminder)

apiRouter.post("/notification", NotificationSub) // route where user subscripes to the notification

//post because axios(frontend) can't send body with GET request
apiRouter.get("/:id", CheckUser, GetSubscriptionById)

apiRouter.post("/edit/:id", CheckUser, EditSubscription )

module.exports = apiRouter