const { notificationModel } = require("../model/Notification")
const webpush = require("web-push");
const subscriptionModel = require("../model/Subscription");
require("dotenv").config

webpush.setVapidDetails(
    "mailto:testi@testi.com",
    process.env.VAPID_PUB,
    process.env.VAPID_PRI
);



//checks if notifications should be sent
async function notificationHandler(){
    
    const allNotifications = await notificationModel.find({})
    
    console.log(`testi ${allNotifications}`)
    for(const notification of allNotifications){

        const currentTime = new Date().getTime()
        console.log(currentTime)
        if(notification.date <= currentTime){
            //TODO send notification

            //gets the subscription, that contains the title, message, etc.
            const notificationSub = await subscriptionModel.findById(notification.sub_id)

            const payload = JSON.stringify({title: notificationSub.title, message: notificationSub.message })
            await webpush.sendNotification(JSON.parse(notification.push) ,payload)

            // TODO remove or add 30 days to the subscription and remove the notificatio from db 

        }

    }


}


module.exports = {notificationHandler}