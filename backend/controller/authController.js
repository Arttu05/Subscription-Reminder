const bcrypt = require("bcrypt")
const userModel = require("../model/user")
const jwt = require("jsonwebtoken")

const saltRounds = 15;

async function RegisterController(req, res){

    //username validation

    const InputUsername = req.body.username

    console.log(InputUsername)

    const foundUserWithSameName = await userModel.find({username: InputUsername})

    if(foundUserWithSameName.length !== 0){
        res.status(409).json({err: "userexists"})
        return
    }

    //Adding the new user to database

    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds)
    
    const newUser = new userModel({
        username: InputUsername,
        password_hash: hashedPassword,
        subscriptions: []
    })

    await newUser.save()

    res.status(200).json(true) // TODO redirect to frontend
} 

async function LoginController(req, res){
    
    const InputUsername = req.body.username
    const InputPassword = req.body.password
    
    //username validation

    const foundUser = await userModel.find({username: InputUsername})

    if(foundUser.length !== 1){
        res.status(401).json(false)
        return
    }

    //password validation

    const passwordComparison = await bcrypt.compare(InputPassword,foundUser[0].password_hash)

    if(passwordComparison === false){
        res.status(401).json(false)
        return
    }

    const userToken = jwt.sign({username: InputUsername, id: foundUser[0]._id },process.env.SERVER_SECRET,{expiresIn: "1d" })

    res.status(200).json({accessToken: userToken})
}
module.exports = {RegisterController, LoginController}