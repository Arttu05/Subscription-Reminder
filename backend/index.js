const express = require("express")
const apiRouter = require("./router/apiRoute")
const authRouter = require("./router/authRoute")
require("dotenv").config()
const bodyParser = require("body-parser")
const { default: mongoose } = require("mongoose")
const cors = require("cors")
const { notificationHandler } = require("./notifications/notificationHandler")
const https = require("https")
const fs = require("fs")

const port = process.env.PORT
const notificationInterval = (1000 * 60 * 5) // 5 minutes
const app =  express()

app.use(cors());
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

console.log(`Starting notification handler with ${notificationInterval} intervals`)
setInterval(notificationHandler, notificationInterval)


mongoose.connect(process.env.MONGO_URL).then(() =>{
    console.log("connected to mongodb")
})


app.use("/api", apiRouter)
app.use("/auth", authRouter)

// Used for self signed ssl.
app.get("/", (req,res) => res.redirect(process.env.FRONTEND_URL))


const httpsOptions = {
    key: fs.readFileSync("../private.key"),
    cert: fs.readFileSync("../certificate.crt")
}


https.createServer(httpsOptions, app).listen(port, () => {
    console.log(`listening to port ${port}`)
})
