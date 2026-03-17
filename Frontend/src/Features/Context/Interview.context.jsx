/**
 * @file interview.context.jsx
 * @description React context that holds interview report state shared between
 * InterviewPlan (form) and InterviewReport (results) pages.
 */

import { createContext, useState } from "react";

/** @type {React.Context} Shared interview state context */
export const InterviewContext = createContext();

/**
 * @component InterviewProvider
 * @description Wraps interview-related routes to share loading/report state
 * without prop-drilling.
 *
 * @param {React.ReactNode} children - Child components that consume the context.
 *
 * Bug fixed: prop was destructured as `Children` (capital C) which shadowed
 * React's built-in `Children` import and never rendered anything.
 */
export const InterviewProvider = ({ children }) => {
  /** @type {[boolean, Function]} True while an API call is in-flight */
  const [loading, setLoading] = useState(false);

  /** @type {[object|null, Function]} The currently viewed interview report */
  const [report, setReport] = useState(null);

  /** @type {[Array, Function]} List of all past interview reports for the user */
  const [reports, setReports] = useState([]);

  return (
    <InterviewContext.Provider
      value={{ loading, setLoading, report, setReport, reports, setReports }}
    >
      {/* lowercase `children` — the actual React prop name */}
      {children}
    </InterviewContext.Provider>
  );
};