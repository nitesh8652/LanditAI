import React from 'react'
import Home from './Home'
import Navbar from '../../Components/Ui/Navbar'
import InterviewPlan from './InterviewPlan'
import SectionDivider from '../../Components/Ui/SectionDivider'
import InterviewReport from './InterviewReport'

const ResumeBuilder = () => {
  return (
    <>
      <Navbar />
      <Home />

      {/* ── Ember divider between hero and interview plan ── */}
      <div
        style={{
          backgroundColor: "#0d0c0b",
          paddingTop: "2.5rem",
          paddingBottom: "2.5rem",
        }}
      >
        <SectionDivider />
      </div>

      <InterviewPlan />
      
    </>
  )
}

export default ResumeBuilder
