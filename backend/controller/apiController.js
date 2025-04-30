
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
        
        if(foundSub != null){
            usersSubscriptionList.push(foundSub) 
        }
    }   

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

    const foundSub = await subscriptionModel.findById(sub_id)

    foundSub.notification = true

    await foundSub.save();

    res.status(200).json(true)

}

async function DeleteNotification(req,res){
    const sub_id = req.params.id
    const foundSub = await subscriptionModel.findById(sub_id)

    if(foundSub == null){
        res.status(400).json(false)
        return;
    }
    
    const foundNoti = await notificationModel.findOne({sub_id: foundSub._id})

    if(foundNoti == null){
        res.status(400).json(false)
        return;
    }
    
    
    
    const deleteInfo = await notificationModel.deleteOne({_id: foundNoti._id})
    
    if(deleteInfo.deletedCount !== 1){
        res.status(400).json(false)   
        return     
    }
    
    foundSub.notification = false;

    await foundSub.save()

    res.status(200).json(true)

}

async function GetSubscriptionById(req, res){
    const sub_id = req.params.id

    const foundSubscription = await subscriptionModel.findById(sub_id)

    if(foundSubscription == null){
        res.status(400).json(false)
        return
    }

    foundSubscription.title = 

    res.status(200).json({subscription: foundSubscription}) 

} 

async function EditSubscription(req ,res){
    const sub_id = req.params.id

    const title = req.body.title
    const message = req.body.message
    const remind_date = req.body.remind_date
    const delete_after = req.body.delete_after
    const remind_again = req.body.remind_again
    
    const foundSub = await subscriptionModel.findById(sub_id)

    if(title == undefined || message == undefined || remind_date == undefined || delete_after == undefined || remind_again == undefined ){
        res.status(400).json(false)
        return
    }

    if(foundSub == null){
        res.status(400).json(false)
        return
    }

    foundSub.title = title
    foundSub.message = message
    foundSub.remind_date = remind_date
    foundSub.delete_after = delete_after
    foundSub.remind_again = remind_again

    await foundSub.save()

    res.status(200).json(true)
}

async function DeleteSubscriptionById(req, res){
    const sub_id = req.params.id

    const deltedSub = await subscriptionModel.deleteOne({_id: sub_id})

    if(deltedSub.deletedCount !== 1){
        res.status(400).json(false)
        return
    }
    

    const user = await userModel.findById(req.user_id)

    const listWithoutDeletedId = user.subscriptions.filter((id) => {
        return id !== sub_id
    })

    user.subscriptions = listWithoutDeletedId

    await user.save()
    
    res.status(200).json(true)
}

module.exports = { GetUserSubscriptions, AddNewReminder, NotificationSub, DeleteNotification , GetSubscriptionById, EditSubscription, DeleteSubscriptionById}