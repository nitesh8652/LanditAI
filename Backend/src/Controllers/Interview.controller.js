/**
 * @file Interview.controller.js
 * @description Request handlers for interview report generation and retrieval.
 *
 * Bugs fixed:
 * - `pdf-parse` is a plain async function, NOT a class. `new pdfParse.PDFParse()`
 *   throws; correct usage is `await pdfParse(buffer)`.
 * - Double `module.exports` at the bottom — the second assignment wiped the first,
 *   exporting only `generateInterViewReportController`. Fixed to one export object.
 * - Missing `getInterviewReportController` and `getAllInterviewReportController`
 *   were not exported in the GitHub version — now included.
 */

const pdfParse              = require("pdf-parse");
const generateInterviewReport = require("../Services/Ai.Service.js");
const interviewReportModel  = require("../Models/InterviewReport.js");

/**
 * @function generateInterViewReportController
 * @description
 *  1. Parses the uploaded PDF buffer into plain text using pdf-parse.
 *  2. Sends text + descriptions to Gemini AI service.
 *  3. Persists the structured report to MongoDB.
 *  4. Returns 201 with the saved document.
 *
 * @route  POST /api/interview/
 * @param  {Express.Request}  req - req.file (PDF buffer), req.body, req.user
 * @param  {Express.Response} res
 */
async function generateInterViewReportController(req, res) {
  try {
    /*
     * pdf-parse(buffer) → { text, numpages, info, ... }
     * It accepts a Buffer directly — no class instantiation needed.
     */
    const parsedPdf = await pdfParse(req.file.buffer);
    const resumeText = parsedPdf.text;

    const { selfDescription, jobDescription } = req.body;

    // Call Gemini AI service — returns structured JSON matching the schema
    const aiReport = await generateInterviewReport({
      resume: resumeText,
      selfDescription,
      jobDescription,
    });

    /*
     * Map AI response keys → Mongoose schema field names.
     * AI returns: technicalQuestions, behavioralQuestions, skillGap
     * Schema uses: technicalQuestion, behaviouralQuestion, skillGaps
     */
    const interviewReport = await interviewReportModel.create({
      user:                req.user._id,        // lowercase — matches schema
      resume:              resumeText,
      selfDescription,
      jobDescription,
      matchScore:          aiReport.matchScore,
      technicalQuestion:   aiReport.technicalQuestions,  // AI: plural → schema: singular
      behaviouralQuestion: aiReport.behavioralQuestions, // AI: behavioral → schema: behavioural
      skillGaps:           aiReport.skillGap,             // AI: singular → schema: plural
      preparationPlan:     aiReport.preparationPlan,
    });

    res.status(201).json({
      success: true,
      message: "Interview Report Generated Successfully",
      interviewReport,
    });
  } catch (err) {
    console.error("generateInterViewReportController error:", err);
    res.status(500).json({ success: false, message: "Failed to generate report." });
  }
}

/**
 * @function getInterviewReportController
 * @description Fetches a single report by ID, scoped to the logged-in user
 * so users cannot read each other's reports.
 *
 * @route  GET /api/interview/interviewReport/:interviewId
 * @param  {Express.Request}  req - req.params.interviewId, req.user
 * @param  {Express.Response} res
 */
async function getInterviewReportController(req, res) {
  try {
    const { interviewId } = req.params;

    // Scope by both _id AND user — prevents IDOR vulnerability
    const interviewReport = await interviewReportModel.findOne({
      _id:  interviewId,
      user: req.user._id,
    });

    if (!interviewReport) {
      return res.status(404).json({
        success: false,
        message: "Interview Report Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Interview Report Fetched Successfully",
      interviewReport,
    });
  } catch (err) {
    console.error("getInterviewReportController error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
}

/**
 * @function getAllInterviewReportController
 * @description Returns a lightweight summary list of all reports for the user.
 * Heavy fields are excluded via .select() to keep the response small.
 *
 * @route  GET /api/interview/
 * @param  {Express.Request}  req - req.user
 * @param  {Express.Response} res
 */
async function getAllInterviewReportController(req, res) {
  try {
    const reports = await interviewReportModel
      .find({ user: req.user._id })
      .sort({ createdAt: -1 })
      // Strip large text fields — client only needs summary cards
      .select(
        "-resume -selfDescription -jobDescription -__v -technicalQuestion -behaviouralQuestion -skillGaps -preparationPlan"
      );

    res.status(200).json({
      success: true,
      message: "Interview Reports Fetched Successfully",
      interviewReport: reports,
    });
  } catch (err) {
    console.error("getAllInterviewReportController error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
}

// ── Single export object — a second module.exports would overwrite this ──
module.exports = {
  generateInterViewReportController,
  getInterviewReportController,
  getAllInterviewReportController,
};