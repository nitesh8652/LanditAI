import { generateInterviewReport, getInterviewReportById, getAllInterviewReports } from "../Services/Interview.api.js"
import { useContext } from "react"
import { InterviewContext } from "../Context/Interview.context.jsx"

export const useInterview = () => {

    const context = useContext(InterviewContext)
    if (!context) {
        throw new Error('useInterview must be used within an InterviewProvider')
    }

    const { user, setUser, loading, setLoading } = context

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        try {
            const response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            setReport(response.InterviewReport)
            setLoading(false)
            return response
        } catch (err) {
            console.log("Error generating report:", err)
        } finally {
            setLoading(false)
        }
    }

    const getReportById = async () => {
        setLoading(true)
        try {
            const response = await getAllInterviewReports
            setReports(response.interviewReports)
        } catch (err) {
            console.log("Error getting report:", err)
        } finally {
            setLoading(false)
        }
    }

    return{
        loading,
        report,
        reports,
        getReports,
        generateReport,
        getReportById,
    }

}