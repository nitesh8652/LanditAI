const express = require("express")
const authMiddleware = require("../Middleware/Auth.middleware.js")
const interviewController = require("../Controllers/Interview.controller.js")
const upload = require ("../Middleware/File.middleware.js")

const interviewRouter = express.Router()


/**
 * @route POST /api/interview
 * @description  Generate an interview report for the candidate on the basis of self description, job description and resume pdf
 * @access Private
 * 
*/
interviewRouter.post("/", authMiddleware.authUser, upload.single("resume"), interviewController.generateInterViewReportController)

module.exports=interviewRouter