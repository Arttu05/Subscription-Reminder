const express = require("express")
const {RegisterController, LoginController} = require("../controller/authController")

const authRouter = express.Router()

authRouter.post("/register",RegisterController)

authRouter.get("/register", (req, res) => { res.status(200).json(4)})

authRouter.post("/login", LoginController)

/*authRouter.post("/logout")
 */
module.exports = authRouter