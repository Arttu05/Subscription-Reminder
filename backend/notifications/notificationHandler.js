const { notificationModel } = require("../model/Notification")
const webpush = require("web-push");
const subscriptionModel = require("../model/Subscription");
const userModel = require("../model/user");
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

            //gets the subscription, that contains the title, message, etc.
            const notificationSub = await subscriptionModel.findById(notification.sub_id)

            const payload = JSON.stringify({title: notificationSub.title, message: notificationSub.message })
            
            try{
                const notficationResults = await webpush.sendNotification(JSON.parse(notification.push) ,payload)
                console.log(`send notification to following user ${notification.user_id}`)

                if(notificationSub.delete_after){

                    const sub_id = notificationSub._id

                    const subDeleteInfo = await subscriptionModel.deleteOne({_id: notificationSub._id})
                    console.log(`deleted ${subDeleteInfo.deletedCount} subscriptions`)
                    const notiDeleteInfo = await notificationModel.deleteOne({_id: notification._id})
                    console.log(`deleted ${notiDeleteInfo.deletedCount} notifications`)
                    
                    //removes from users subscriptions
                    //TODO add pre delete where this is handled

                    const foundUser = await userModel.findById(notification.user_id)

                    const listWithoutDeletedId = foundUser.subscriptions.filter((id) => {
                        return id !== sub_id
                    })
                
                    foundUser.subscriptions = listWithoutDeletedId
                
                    await foundUser.save()

                }
    
                else if(notificationSub.remind_again){
                    notificationSub.remind_date = (notificationSub.remind_date + 2592000000)
                    await notificationSub.save()
                    notification.date = (notification.date + 2592000000)
                    await notification.save()
                    console.log("Added 30 days to next remind")
                }
            }
            catch(err){
                console.log(`error while sending notification to user: ${notification.user_id}`)
                console.log(`error: ${err}`)
            }

        }

    }


}


module.exports = {notificationHandler}