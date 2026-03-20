const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, "Username already exists"],
        required: true
    },

    email: {
        type: String,
        unique: [true, "Email already exists"],
        required: true
    },

    password: {
        type: String,
        required: true
    },

    //google field
    googleUid: {
        type: String,
        default: null
    }

})

const userModel = mongoose.model('Users', userSchema);

module.exports = userModel