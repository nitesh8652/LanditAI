const pdfParse = require("pdf-parse");
const { generateInterviewReport, generateResumePdf } = require("../Services/Ai.Service.js");
const interviewReportModel = require("../Models/InterviewReport.js");


/**
 * @function generateInterViewReportController
 * @route  POST /api/interview/
 */



async function generateInterViewReportController(req, res) {
  try {
    console.log("━━━ req.file ━━━", req.file)
    console.log("━━━ req.body ━━━", req.body)

    let resumeText = "";
    if (req.file?.buffer) {
      const parsedPdf = await new pdfParse.PDFParse(Uint8Array.from(req.file.buffer)).getText();
      resumeText = parsedPdf.text;
    }

    const { selfDescription, jobDescription } = req.body;

    // Require at least one profile source
    if (!resumeText && !selfDescription?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide either a resume file or a self-description.",
      });
    }

    const aiReport = await generateInterviewReport({
      resume: resumeText,
      selfDescription,
      jobDescription,
    });

    const interviewReport = await interviewReportModel.create({
      user: req.user._id,
      resume: resumeText,
      selfDescription,
      jobDescription,
      title: aiReport.title,
      matchScore: aiReport.matchScore,
      technicalQuestion: aiReport.technicalQuestions,
      behaviouralQuestion: aiReport.behavioralQuestions,
      skillGaps: aiReport.skillGap,
      preparationPlan: aiReport.preparationPlan,
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
 * @route  GET /api/interview/interviewReport/:interviewId
 */
async function getInterviewReportController(req, res) {
  try {
    const { interviewId } = req.params;

    const interviewReport = await interviewReportModel.findOne({
      _id: interviewId,
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
 * @route  GET /api/interview/
 */
async function getAllInterviewReportController(req, res) {
  try {
    const reports = await interviewReportModel
      .find({ user: req.user._id })
      .sort({ createdAt: -1 })
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

/**
 * @function generateResumePdf
 * @route  POST /api/interview/generatingResumePdf
 */

async function generateResumePdfController(req, res) {
  try {
    const { intervewReportId } = req.params;

    const interviewReport = await interviewReportModel.findById(intervewReportId);

    if (!interviewReport) {
      return res.status(404).json({
        message: "Interview Report not found"
      });
    }

    const { resume, jobDescription, selfDescription } = interviewReport;

    const pdfBuffer = await generateResumePdf({
      resume,
      selfDescription,
      jobDescription
    });

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=resume_${intervewReportId}.pdf`
    });

    res.status(200).send(pdfBuffer);

  } catch (err) {
    console.error("generateResumePdfController error:", err);
    res.status(500).json({ message: "Failed to generate PDF" });
  }
}

module.exports = {
  generateInterViewReportController,
  getInterviewReportController,
  getAllInterviewReportController,
  generateResumePdfController 
};