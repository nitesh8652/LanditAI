const mongoose = require("mongoose")

async function connectDB() {
    try{
        mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to MongoDB")
    }catch(err){
        console.log("error", err)
    }
}

module.exports = connectDB;