require("dotenv").config()
const app = require("../Backend/src/App")
const connectToDB = require("../Backend/src/Config/Mongo")
const gemini = require("../Backend/src/Services/Ai.Service.js")


connectToDB()


app.listen(3000, () => {
    console.log("Server is running on port 3000")
})