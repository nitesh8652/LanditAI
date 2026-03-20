const { GoogleGenAI, Type } = require("@google/genai")
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
})

// Define schema directly using Gemini's native schema format
const interviewReportSchema = {
    type: Type.OBJECT,
    properties: {

        title: {
            type: Type.STRING,
            description: "Title of the job for which the interview report is generated"
        },
        matchScore: {
            type: Type.NUMBER,
            description: "A score between 0 and 100 how well the candidate's profile matches the job description"
        },
        technicalQuestions: {
            type: Type.ARRAY,
            description: "Technical questions that can be asked in the interview",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING, description: "Technical question for the interview" },
                    intention: { type: Type.STRING, description: "Interviewer's intention behind the question" },
                    answer: { type: Type.STRING, description: "How to answer this question and what points to cover" }
                },
                required: ["question", "intention", "answer"]
            }
        },
        behavioralQuestions: {
            type: Type.ARRAY,
            description: "Behavioral questions that can be asked in the interview",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING, description: "Behavioral question for the interview" },
                    intention: { type: Type.STRING, description: "Interviewer's intention behind the question" },
                    answer: { type: Type.STRING, description: "How to answer this question and what points to cover" }
                },
                required: ["question", "intention", "answer"]
            }
        },
        skillGap: {
            type: Type.ARRAY,
            description: "List of skill gaps in the candidate's profile",
            items: {
                type: Type.OBJECT,
                properties: {
                    skill: { type: Type.STRING, description: "Skill in which the candidate is lacking or weak" },
                    severity: {
                        type: Type.STRING,
                        enum: ["low", "medium", "high"],
                        description: "Severity of the skill gap"
                    }
                },
                required: ["skill", "severity"]
            }
        },
        preparationPlan: {
            type: Type.ARRAY,
            description: "Day-wise preparation plan for the candidate",
            items: {
                type: Type.OBJECT,
                properties: {
                    day: { type: Type.NUMBER, description: "Day number starting from 1" },
                    focus: { type: Type.STRING, description: "Main focus of this day, e.g. System Design, DSA" },
                    tasks: {
                        type: Type.ARRAY,
                        description: "List of tasks to complete on this day",
                        items: { type: Type.STRING }
                    }
                },
                required: ["day", "focus", "tasks"]
            }
        }
    },
    required: ["title", "matchScore", "technicalQuestions", "behavioralQuestions", "skillGap", "preparationPlan"],

}

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `Generate an interview report for the candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}`

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: interviewReportSchema
        }
    })

    const parsed = JSON.parse(response.text)
    console.log(JSON.stringify(parsed, null, 2))
    return parsed
}

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.setContent(htmlContent)
    // await page.setContent(htmlContent,{waitUntil:"networkidle0"})
    
    const pdfBuffer = await page.pdf({ format: 'A4' })
    await browser.close()
    return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
  const resumePdfSchema = {
    type: Type.OBJECT,
    properties: {
      html: { type: Type.STRING, description: "Complete HTML content of the resume, styled inline, ready to be rendered by puppeteer into a PDF" }
    },
    required: ["html"]
  };

  const prompt = `Generate a clean, professional resume HTML page from the following details.
Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}

Return a single HTML document with inline CSS styles. No external stylesheets or scripts.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: resumePdfSchema
    }
  });

  const { html } = JSON.parse(response.text);
  return generatePdfFromHtml(html);
}


module.exports = {  
    generateInterviewReport,
    generateResumePdf}