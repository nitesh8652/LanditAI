/**
 * @file Interview.routes.js
 * @description Express router for all interview report endpoints.
 * Mounted at /api/interview in App.js.
 *
 * Full URL map:
 *  POST   /api/interview/                           → generate report
 *  GET    /api/interview/                           → get all reports (summary)
 *  GET    /api/interview/interviewReport/:interviewId → get single report
 */

const express            = require("express");
const authMiddleware     = require("../Middleware/Auth.middleware.js");
const interviewController = require("../Controllers/Interview.controller.js");
const upload             = require("../Middleware/File.middleware.js");

const interviewRouter = express.Router();

/**
 * @route  POST /api/interview/
 * @description Generate an AI interview report from resume PDF + descriptions.
 * @access Private — requires valid JWT cookie.
 * @middleware authUser   — validates JWT & attaches req.user
 * @middleware upload.single("resume") — parses multipart PDF into req.file
 */
interviewRouter.post(
  "/",
  authMiddleware.authUser,
  upload.single("resume"),
  interviewController.generateInterViewReportController
);

/**
 * @route  GET /api/interview/interviewReport/:interviewId
 * @description Fetch a single interview report by its MongoDB _id.
 * @access Private
 * @param  {string} interviewId - MongoDB ObjectId of the report.
 */
interviewRouter.get(
  "/interviewReport/:interviewId",
  authMiddleware.authUser,
  interviewController.getInterviewReportController
);

/**
 * @route  GET /api/interview/
 * @description Fetch a lightweight list of all reports for the logged-in user.
 * Heavy fields (resume text, questions) are stripped by the controller .select().
 * @access Private
 */
interviewRouter.get(
  "/",
  authMiddleware.authUser,
  interviewController.getAllInterviewReportController
);

module.exports = interviewRouter;