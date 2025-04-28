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
    
    console.log(`notfication count ${allNotifications.length}`)
    for(const notification of allNotifications){

        const currentTime = new Date().getTime()
        if(notification.date <= currentTime){
            //TODO send notification

            //gets the subscription, that contains the title, message, etc.
            const notificationSub = await subscriptionModel.findById(notification.sub_id)

            const payload = JSON.stringify({title: notificationSub.title, message: notificationSub.message })
            
            try{
                const notficationResults = await webpush.sendNotification(JSON.parse(notification.push) ,payload)
                console.log(`send notification to following user ${notficationResults.user_id}`)
            }
            catch(err){
                console.log(`error while sending notification to user: ${notification.user_id}`)
                console.log(`error: ${err}`)
            }


            // TODO remove or add 30 days to the subscription and remove the notificatio from db 

        }

    }


}


module.exports = {notificationHandler}