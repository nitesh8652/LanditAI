const pdfParse = require("pdf-parse")
const generateInterviewReport = require("../Services/Ai.Service.js")
const interviewReportModel = require("../Models/InterviewReport.js")

async function generateInterViewReportController(req, res) {

    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
    const { selfDescription, jobDescription } = req.body

    const interviewReportByAi = await generateInterviewReport({
        resume: resumeContent.text,
        selfDescription,
        jobDescription
    })

    const interviewReport = await interviewReportModel.create({
        user: req.user._id,
        resume: resumeContent.text,
        selfDescription,
        jobDescription,
        matchScore: interviewReportByAi.matchScore,
        technicalQuestion: interviewReportByAi.technicalQuestions,       // plural → singular
        behaviouralQuestion: interviewReportByAi.behavioralQuestions,    // behavioral → behavioural
        skillGaps: interviewReportByAi.skillGap,                         // singular → plural
        preparationPlan: interviewReportByAi.preparationPlan,

    })

    res.status(201).json({
        success: true,
        message: "Interview Report Generated Successfully",
        interviewReport
    })

}




module.exports = { generateInterViewReportController }