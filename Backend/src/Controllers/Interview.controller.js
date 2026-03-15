const pdfParse = require("pdf-parse")
const generateInterviewReport = require("../Services/Ai.Service.js")

async function generateInterViewReportController(req,res){

    const resumeFile = req.file

    const resumeContent= pdfParse(resume.file.buffer)
    const {selfDescription, jobDescription} = req.body

    const interviewReportByAi = await generateInterviewReport({
        resume:resumeContent,
        selfDescription,
        jobDescription
    })
}



module.exports = {generateInterViewReportController}