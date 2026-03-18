/**
 * @file interview.api.js
 * @description Axios service layer for all interview-related API calls.
 * Uses a configured instance so the base URL is written only once.
 */

import axios from "axios";

/**
 * Configured Axios instance for the interview API.
 * `withCredentials: true` ensures the JWT cookie is sent on every request.
 */
const api = axios.create({
  baseURL: "http://localhost:3000/api/interview",
  withCredentials: true,
});

/**
 * @function generateInterviewReport
 * @description Sends resume PDF, job description, and self-description to the
 * backend AI service and returns a structured interview report.
 *
 * @param {object}  params
 * @param {string}  params.jobDescription  - Raw text of the target job posting.
 * @param {string}  params.selfDescription - Candidate's own summary (optional if resume provided).
 * @param {File}    params.resumeFile      - PDF file selected by the user.
 * @returns {Promise<object>} The generated interview report from the backend.
 */
export const generateInterviewReport = async ({
  jobDescription,
  selfDescription,
  resumeFile,
}) => {
  const formData = new FormData();
  formData.append("jobDescription", jobDescription);
  formData.append("selfDescription", selfDescription);
  formData.append("resume", resumeFile); // multer field name must match

  const response = await api.post("/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

/**
 * @function getInterviewReportById
 * @description Fetches a single interview report by its MongoDB ObjectId.
 *
 * @param {string} interviewId - The `_id` of the InterviewReport document.
 * @returns {Promise<object>} The interview report object.
 *
 * Bug fixed: called `/report/:id` but backend route is `/interviewReport/:id`.
 */
export const getInterviewReportById = async (interviewId) => {
  const response = await api.get(`/interviewReport/${interviewId}`);
  return response.data;
};

/**
 * @function getAllInterviewReports
 * @description Fetches a paginated summary list of all reports for the logged-in user.
 * Heavy fields (resume text, questions) are stripped server-side for performance.
 *
 * @returns {Promise<Array>} Array of lightweight report summary objects.
 */
export const getAllInterviewReports = async () => {
  const response = await api.get("/");
  return response.data;
};