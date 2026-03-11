const mongoose = require('mongoose');

const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "Token is added to blacklist."]
    }
}, {
    timestamps: true,
    expires:86400
})

const tokenBlacklistModel = mongoose.model("TokenBlacklist", blacklistTokenSchema);

module.exports={
    tokenBlacklistModel
}
