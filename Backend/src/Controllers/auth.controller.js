const admin = require("../Config/FirebaseAdmin.js")
const userModel = require('../Models/User')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { tokenBlacklistModel } = require('../Models/Blacklist.model');


/**
 * 
 * @name register user
 * @description register new user, excepts username, email and password in the request body
 */

async function registerUserController(req, res) {

    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({
            message: "Please provide username, email and password"
        })
    }

    const userAlreadyExists = await userModel.findOne({
        $or: [{ username }, { email }]  //check if username or email already exists if any one of the property matches then we will return 400

    });

    if (userAlreadyExists) {
        if (userAlreadyExists.username === username) {
            return res.status(400).json({
                message: "User with this username already exists"
            })
        }

        if (userAlreadyExists.email === email) {
            return res.status(400).json({
                message: "User with this email already exists"
            })
        }
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email,
        password: hash
    })

    const token = jwt.sign(
        {
            id: user._id,
            username: user.username
        },
        process.env.JWT_SECRET
        , { expiresIn: '7d' }
    )
    res.cookie("token", token)
    res.status(201).json({
        message: "User created successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })

}

/**
 * 
 * @name login user
 * @description login user, excepts username, email and password in the request body
 */

async function loginUserController(req, res) {

    const { email, password } = req.body

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    //password which comes from bordy(req.body) & user.password which comes fromdata base 
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password"
        })
    }

    const token = jwt.sign(
        {
            id: user._id,
            username: user.username
        },
        process.env.JWT_SECRET
        , { expiresIn: '7d' }
    )

    res.cookie("token", token)
    res.status(200).json({
        message: "User logged in successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}


/**
 * @route GET /api/auth/logout
 * @description  logout a user using token blacklist, cookies via mongodb
 * @access Public
 */

async function logoutUserController(req, res) {

    const token = req.cookies.token

    if (token) {
        await tokenBlacklistModel.create({ token })
    }
    res.clearCookie("token")
    res.status(200).json({
        message: "User logged out successfully"
    })

}

/**
 * @route verifyController
 * @description  get the current user loged in details
 * @access private
 */

async function verifyController(req, res) {

    const user = await userModel.findById(req.user.id)

    res.status(200).json({
        message: "User verified successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })

}

/**
 * @route  POST /api/auth/google
 * @description  Verifies a Firebase ID token from the frontend Google popup.
 *               Creates a new user in MongoDB if first-time login,
 *               or finds the existing one. Issues a JWT cookie — same flow
 *               as regular login so the rest of the app is unaffected.
 * @access Public
 */

async function googleAuthController(req, res) {

    try {
        const { idToken } = req.body;
        if (!idToken) {
            return res.status(400).json({ message: "ID required" })
        }

        const decodedToken = await admin.auth().verifyIdToken(idToken)
        // decodedToken contains: uid, email, name, picture (from Google)
        const { email, name, uid } = decodedToken;

        let user = await userModel.findOne({ email })

        if (!user) {
            // First time Google login → create account automatically
            // No password needed — googleUid acts as the identity proof
            // We hash a random string as a placeholder password so the schema
            // required:true constraint is satisfied without a real password.
            const placeholderhash = await bcrypt.hash(uid + process.env.JWT_SECRET, 10)
            user = await userModel.create({
                username: name,
                email,
                password: placeholderhash,
                googleUid: uid, // Store Google UID for future reference
            });

        }
        //issue our own jwt we dont rely on fire base for session management

        const token = jwt.sign({
            id: user._id, username: user.username
        }, process.env.JWT_SECRET,
            { expiresIn: "7d" })

        res.cookie("token", token);
        res.status(200).json({
            message: "google login in successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })

    } catch (err) {
        console.error("googleAuthController error:", err);
        res.status(500).json({ success: false, message: "Server error." });

        // Firebase throws specific errors we can surface
        if (err.code === "auth/id-token-expired") {
            return res.status(401).json({ message: "Google session expired. Please sign in again." });
        }
        if (err.code === "auth/argument-error") {
            return res.status(400).json({ message: "Invalid ID token." });
        }

        return res.status(500).json({ message: "Failed to authenticate with Google." });
    }

}


module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    verifyController,
    googleAuthController
}