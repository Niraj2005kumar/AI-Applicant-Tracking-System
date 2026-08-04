import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    resume: {
      type: String,
      default: "",
    },

    coverLetter: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Reviewed",
        "Shortlisted",
        "Rejected",
        "Hired",
      ],
      default: "Pending",
    },

    // AI Resume Extraction
    resumeText: {
      type: String,
      default: "",
    },

    skills: {
      type: [String],
      default: [],
    },

    experience: {
      type: Number,
      default: 0,
    },

    education: {
      type: String,
      default: "",
    },

    certifications: {
      type: [String],
      default: [],
    },

    projects: {
      type: [String],
      default: [],
    },

    keywords: {
      type: [String],
      default: [],
    },

    // AI Match Scores
    atsScore: {
      type: Number,
      default: 0,
    },

    matchPercentage: {
      type: Number,
      default: 0,
    },

    skillMatch: {
      type: Number,
      default: 0,
    },

    experienceMatch: {
      type: Number,
      default: 0,
    },

    recommendation: {
      type: String,
      enum: ["Highly Recommended", "Recommended", "Neutral", "Not Recommended"],
      default: "Neutral",
    },

    missingSkills: {
      type: [String],
      default: [],
    },

    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

applicationSchema.index(
  {
    candidate: 1,
    job: 1,
  },
  {
    unique: true,
  }
);

const Application = mongoose.model("Application", applicationSchema);

export default Application;