import {
  generateInterviewReport,
  getInterviewReportById,
  getAllInterviewReports,
} from "../Services/Interview.api.js";
import { useContext } from "react";
import { InterviewContext } from "../Context/Interview.context.jsx";

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }

  // ✅ Fixed: was destructuring `user, setUser` which don't exist in InterviewContext.
  //    InterviewContext provides: loading, setLoading, report, setReport, reports, setReports
  const { loading, setLoading, report, setReport, reports, setReports } = context;

  /**
   * @function generateReport
   * @description Calls the AI service, stores the result in context, and
   * returns the saved report so the caller can navigate to it by _id.
   *
   * Bugs fixed:
   * - `setReport` was used without being destructured from context → ReferenceError
   * - `response.InterviewReport` (capital I) → controller returns `interviewReport`
   * - Returned `response` (the full axios wrapper) instead of the report document
   */
  const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
    setLoading(true);
    try {
      const response = await generateInterviewReport({
        jobDescription,
        selfDescription,
        resumeFile,
      });
      // ✅ Fixed: lowercase `interviewReport` matches what the controller returns
      const savedReport = response?.interviewReport;
      setReport(savedReport);
      return savedReport; // caller uses ._id to navigate
    } catch (err) {
      console.error("Error generating report:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * @function getReportById
   * @description Fetches a single report by ID and stores it in context.
   * Called by InterviewReport on mount when context is empty (e.g. page refresh).
   *
   * Bug fixed: previous version called `getAllInterviewReports` (wrong fn) and
   * forgot to invoke it with `()`.
   */
  const getReportById = async (interviewId) => {
    setLoading(true);
    try {
      const response = await getInterviewReportById(interviewId);
      setReport(response?.interviewReport);
    } catch (err) {
      console.error("Error fetching report:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * @function getReports
   * @description Fetches the summary list of all reports for the logged-in user.
   *
   * Bug fixed: was previously named `getReportById` but called getAllInterviewReports;
   * renamed and corrected.
   */
  const getReports = async () => {
    setLoading(true);
    try {
      const response = await getAllInterviewReports();
      // controller returns `interviewReport` (array) for the list endpoint
      setReports(response?.interviewReport);
    } catch (err) {
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    report,
    reports,
    generateReport,
    getReportById,
    getReports,
  };
};