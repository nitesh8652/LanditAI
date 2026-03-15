require("dotenv").config()
const app = require("../Backend/src/App")
const connectToDB = require("../Backend/src/Config/Mongo")
const gemini = require("../Backend/src/Services/Ai.Service.js")
const {resume, selfDescription, jobDescription} = require("../Backend/src/Services/Dummy.js")
const generateInterviewReport = require("../Backend/src/Services/Ai.Service.js")

connectToDB()
generateInterviewReport({resume, selfDescription, jobDescription})

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})