import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },

    jobType: {
      type: String,
      enum: ["Full Time", "Part Time", "Internship", "Contract", "Remote"],
      default: "Full Time",
    },

    salary: {
      type: Number,
      required: [true, "Salary is required"],
      min: 0,
    },

    description: {
      type: String,
      required: [true, "Job description is required"],
    },

    requirements: {
      type: [String],
      default: [],
    },

    skills: {
      type: [String],
      default: [],
    },

    experience: {
      type: Number,
      default: 0,
      min: 0,
    },

    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    applicationDeadline: {
      type: Date,
      required: true,
    },

    vacancies: {
      type: Number,
      default: 1,
      min: 1,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;