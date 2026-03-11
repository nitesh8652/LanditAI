const jwt = require("jsonwebtoken")
const {tokenBlacklistModel} = require("../Models/Blacklist.model")

async function authUser(req, res, next) {

    const token = req.cookies.token
    if (!token) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    const isTokenBlacklisted = await tokenBlacklistModel.findOne({ token })

    if (isTokenBlacklisted) {
        return res.status(401).json({
            message: "Token is invalid."
        })
    }

    try {

        //jo bhi data hai token bana ne ke baad woh data decoded me store hoga badme ek new property banake (req.user) usme  data store hoga fir request ko aage forward kr dete hae controlller me   

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (err) {
        return res.status(401).json({
            message: "Invalid Token"
        })
    }

}

module.exports = {
    authUser
}