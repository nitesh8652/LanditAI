require("dotenv").config()
const app = require("../Backend/src/App")
const connectToDB = require("../Backend/src/Config/Mongo")

connectToDB()


app.listen(3000, () => {
    console.log("Server is running on port 3000")
})