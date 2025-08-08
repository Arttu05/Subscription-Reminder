const userModel = require("../model/user")

// makes sure the user has rights to the subscription.
async function CheckUser(req,res, next){

    const sub_id = req.params.id

    const user = await userModel.findById(req.user_id)

    if(user.subscriptions.includes(sub_id)){
        next()
        return
    }

    res.status(400).json(false)

}

module.exports = {CheckUser}