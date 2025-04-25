
const { notificationModel } = require("../model/Notification")
const subscriptionModel = require("../model/Subscription")
const userModel = require("../model/user")

// all request have req.user_id from midleware
async function GetUserSubscriptions(req, res){
    const userId = req.user_id

    const foundUser = await userModel.findById(userId)

    if(foundUser.subscriptions.length < 1){
        res.status(200).json([])
        return
    }

    let usersSubscriptionList= []
    
    for(const subId of foundUser.subscriptions){
        const foundSub = await subscriptionModel.findById(subId)
    
        usersSubscriptionList.push(foundSub) 
    }    

   /*  await foundUser.subscriptions.forEach(async subscriptionId => {
        const foundSub = await subscriptionModel.findById(subscriptionId)
        
        // TODO, make sure the foundsub exists and is not null
        
        usersSubscriptionList.push(foundSub) 

    }); */

    res.status(200).json(usersSubscriptionList)

}

async function AddNewReminder(req,res){

    const title = req.body.title
    const message = req.body.message
    const remind_date = req.body.selected_date
    const delete_after = req.body.delete_after
    const remind_again = req.body.again_after
    
    if(title == undefined || message == undefined || remind_date == undefined || delete_after == undefined || remind_again == undefined ){
        res.status(400).json(false)
    }

    const newSubscription = new subscriptionModel({
        title: title,
        message: message,
        remind_date: remind_date,
        delete_after: delete_after,
        remind_again: remind_again
    })

    const newSub = await newSubscription.save()
    console.log(newSub)

    // adding the subscription to user

    const currentUser = await userModel.findById(req.user_id)

    currentUser.subscriptions.push(newSub._id);

    const updatedUser = await currentUser.save()

    console.log(updatedUser)

    res.status(200).json(true)

}


async function NotificationSub(req,res){
    const user_id = req.user_id;
    const sub_id = req.body.sub_id;
    const push = JSON.stringify(req.body.push);
    const remind_date = req.body.remind_date

    if(user_id === undefined || sub_id === undefined || push === undefined || remind_date == undefined){
        res.status(400).json(false)
        return
    }

    const newNotification = new notificationModel({
        date: remind_date,
        push: push,
        user_id: user_id,
        sub_id: sub_id,
         
    })

    await newNotification.save()

    res.status(200).json(true)

}

module.exports = { GetUserSubscriptions, AddNewReminder, NotificationSub}