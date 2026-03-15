    const mongoose = require('mongoose')

    /**
     @Job_description
    @Resume_Text
    @Self_description
    @Score
    @technical_questions : [{}]
    @behavioral_questions : []
    @Skill_gaps : []
    @Preparation_plan : [{}]
    */


    const technicalQuestionSchema = new mongoose.Schema({
        question: {
            type: String,
            required: [true, "Technical question is required"]
        },
        intention: {
            type: String,
            required: [true, "Intention is required"]
        },
        answer: {
            type: String,
            required: [true, "Answer is required"]
        }
    }, {
        _id: false
    })

    const behaviouralQuestionSchema = new mongoose.Schema({
        question: {
            type: String,
            required: [true, "Technical question is required"]
        },
        intention: {
            type: String,
            required: [true, "Intention is required"]
        },
        answer: {
            type: String,
            required: [true, "Answer is required"]
        }
    }, {
        _id: false
    })

    const skillGaps = new mongoose.Schema({
        skill: {
            type: String,
            required: [true, "Skill is required"]
        },
        severity: {
            type: String,
            required: [true, "Severity is required"]
        }

    }, {
        _id: false
    })

    const PreparationPlan = new mongoose.Schema({
        day: {
            type: Number,
            required: [true, "Day is required"]
        },
        focus: {
            type: String,
            required: [true, "focus is required"]
        },
        tasks:[{
            type:String,
            required:[true,"Task is required"]      
        }]

    }, {
        _id: false
    })

    const InterviewReportSchema = new mongoose.Schema({
        jobDescription: {
            type: String,
            required: true
        },
        resume: {
            type: String,
        },
        selfDescription: {
            type: String,
        },
        matchScore: {
            type: Number,
            min: 0,
            max: 100
        },
        technicalQuestion: [technicalQuestionSchema],
        behaviouralQuestion: [behaviouralQuestionSchema],
        skillGaps: [skillGaps],
        preparationPlan: [PreparationPlan],
        User:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    }, {
        timestamps: true
    })

    const interviewReportModel = mongoose.model("InterviewReport", InterviewReportSchema);

module.exports = interviewReportModel