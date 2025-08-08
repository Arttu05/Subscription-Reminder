const jwt = require("jsonwebtoken")
require("dotenv").config

function ValidateToken(req, res, next){

    const authHeader = req.headers["authorization"]

    if(authHeader === undefined){
        res.status(401).json(false)
        return
    }

    const token  = authHeader.split(" ")[1] // the header is like this:  BEARER [TOKEN]
                                            // so split takes the [TOKEN]
    if(token == null){
        res.status(401).json(false)
        return
    }

    jwt.verify(token,process.env.SERVER_SECRET, (err, user) => {
        if(err){
            res.status(401).json(false)
            return
        }

        req.user_id = user.id 

        next()
    })
}

module.exports = ValidateToken