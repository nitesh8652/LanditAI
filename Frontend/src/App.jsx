/**
 * @file App.jsx
 * @description Root application component.
 * Sets up global auth context, background styling, client-side routing,
 * and the InterviewProvider for interview-scoped state.
 */

import { BrowserRouter, Routes, Route } from "react-router";
import { ContextProvider } from "./Features/Context/Context.jsx";
import { InterviewProvider } from "./Features/Context/Interview.context.jsx";
import Protected from "./Features/Components/Middleware/Protected.jsx";

import Hero           from "./Features/Pages/Hero.jsx";
import Login          from "./Features/Pages/Login.jsx";
import Register       from "./Features/Pages/Register.jsx";
import ResumeBuilder  from "./Features/Interview Report/Pages/ResumeBuilder.jsx";
import InterviewPlan  from "./Features/Interview Report/Pages/InterviewPlan.jsx";
import InterviewReport from "./Features/Interview Report/Pages/InterviewReport.jsx";

/**
 * @component App
 * @description
 * - `ContextProvider` exposes global auth state (user, loading) to the whole tree.
 * - `InterviewProvider` scopes interview report state to interview-related pages.
 * - `Protected` is a route middleware that redirects unauthenticated users to /login.
 */
function App() {
  return (
    <ContextProvider>
      {/* Primary dark background used across all pages */}
      <div className="min-h-screen bg-[#0d0c0b]">
        <BrowserRouter>
          {/*
           * InterviewProvider must live INSIDE BrowserRouter (so its children
           * can use useNavigate/useParams) but OUTSIDE <Routes> so it persists
           * across interview route navigations.
           */}
          <InterviewProvider>
            <Routes>
              {/* ── Public routes ── */}
              <Route path="/"         element={<Hero />} />
              <Route path="/login"    element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* ── Protected routes ── require a valid JWT cookie ── */}
              <Route
                path="/ResumeBuilder"
                element={
                  <Protected>
                    <ResumeBuilder />
                  </Protected>
                }
              />
              <Route
                path="/interviewPlan"
                element={
                  <Protected>
                    <InterviewPlan />
                  </Protected>
                }
              />
              {/*
               * :interviewId is the MongoDB _id of the report document.
               * Leading slash is required — "interviewReport/..." would be relative.
               */}
              <Route
                path="/interviewReport/:interviewId"
                element={
                  <Protected>
                    <InterviewReport />
                  </Protected>
                }
              />
            </Routes>
          </InterviewProvider>
        </BrowserRouter>
      </div>
    </ContextProvider>
  );
}

export default App;