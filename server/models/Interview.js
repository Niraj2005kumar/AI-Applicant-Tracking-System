import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
      unique: true,
    },
    interviewDate: {
      type: Date,
      required: true,
    },
    interviewTime: {
      type: String,
      required: true,
      trim: true,
    },
    mode: {
      type: String,
      enum: ["Online", "Offline"],
      required: true,
    },
    meetingLink: {
      type: String,
      trim: true,
      default: "",
    },
    location: {
      type: String,
      trim: true,
      default: "",
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: [
        "Scheduled",
        "Completed",
        "Cancelled",
        "Rescheduled",
      ],
      default: "Scheduled",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Interview", interviewSchema);