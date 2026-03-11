const {Router} = require('express');
const authController = require('../Controllers/auth.controller');
const authMiddleware = require('../Middleware/Auth.middleware');
const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @description  Register a new user
 * @access Public
 */
authRouter.post('/register',authController.registerUserController);

/**
 * @route POST /api/auth/login
 * @description  login a user
 * @access Public
 */ 
authRouter.post('/login',authController.loginUserController);

/**
 * @route GET /api/auth/logout
 * @description  logout a user using token blacklist, cookies via mongodb
 * @access Public
 */ 
authRouter.get('/logout',authController.logoutUserController);

/**
 * @route GET /api/auth/verify
 * @description  verify a user and get the current user details
 * @access Private
 */
authRouter.get("/verify", authMiddleware.authUser,authController.verifyController );

module.exports = authRouter;