
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import User from "../models/User.js";
import { createNotification } from "./notificationController.js";
import { extractTextFromPDF, parseResumeText, matchResumeWithJob } from "../services/aiService.js";

// Apply for a Job
export const applyForJob = async (req, res) => {
  try {
    const { coverLetter } = req.body || {};
    const { jobId } = req.params;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    const alreadyApplied = await Application.findOne({
      candidate: req.user._id,
      job: jobId,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job.",
      });
    }

    // Determine the resume file to use
    let resumePath = "";
    if (req.file) {
      resumePath = `/uploads/${req.file.filename}`;
    } else {
      // Fallback to user profile resume
      const user = await User.findById(req.user._id);
      if (user && user.resume) {
        resumePath = user.resume;
      }
    }

    if (!resumePath) {
      return res.status(400).json({
        success: false,
        message: "Resume is required. Please upload a file or complete your profile resume.",
      });
    }

    // AI Parsing & Score Analysis
    let resumeText = "";
    let parsedResume = {
      skills: [],
      experience: 1,
      education: "Not Specified",
      certifications: [],
      projects: [],
      keywords: []
    };
    let matchScores = {
      atsScore: 50,
      matchPercentage: 50,
      skillMatch: 50,
      experienceMatch: 50,
      recommendation: "Neutral",
      keywords: []
    };

    try {
      if (resumePath.toLowerCase().endsWith(".pdf")) {
        resumeText = await extractTextFromPDF(resumePath);
        parsedResume = parseResumeText(resumeText);
        matchScores = matchResumeWithJob(parsedResume, job);
      } else {
        // Fallback using candidates database profile details
        const user = await User.findById(req.user._id);
        parsedResume = {
          skills: user.skills || [],
          experience: user.experience || 1,
          education: user.education || "Bachelor's Degree",
          certifications: [],
          projects: [],
          keywords: []
        };
        matchScores = matchResumeWithJob(parsedResume, job);
      }
    } catch (parseErr) {
      console.error("AI Parsing failed during application:", parseErr);
    }

    let application;
    try {
      application = await Application.create({
        candidate: req.user._id,
        job: jobId,
        coverLetter: coverLetter || "",
        resume: resumePath,
        // AI details
        resumeText,
        skills: parsedResume.skills,
        experience: parsedResume.experience,
        education: parsedResume.education,
        certifications: parsedResume.certifications,
        projects: parsedResume.projects,
        keywords: matchScores.keywords,
        atsScore: matchScores.atsScore,
        matchPercentage: matchScores.matchPercentage,
        skillMatch: matchScores.skillMatch,
        experienceMatch: matchScores.experienceMatch,
        recommendation: matchScores.recommendation,
      });
    } catch (dbError) {
      if (dbError.code === 11000) {
        return res.status(400).json({
          success: false,
          message: "You have already applied for this job.",
        });
      }
      throw dbError;
    }

    await createNotification({
      recipient: job.recruiter,
      sender: req.user._id,
      title: "New Application",
      message: `A new application has been submitted for ${job.title}. ATS Match Score: ${application.atsScore}%.`,
      type: "Application",
      relatedId: application._id,
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully.",
      application,
    });
  } catch (error) {
    console.error("Application error:", error.stack || error);

    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// Get My Applications
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      candidate: req.user._id,
    })
      .populate("job")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Get Applications for a Job
export const getApplicationsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found.",
      });
    }

    if (
      req.user.role !== "admin" &&
      job.recruiter.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    const applications = await Application.find({
      job: jobId,
    })
      .populate("candidate", "name email phone skills experience education")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Update Application Status
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const application = await Application.findById(req.params.id).populate(
      "job"
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    if (
      req.user.role !== "admin" &&
      application.job.recruiter.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    application.status = status;

    await application.save();

    res.status(200).json({
      success: true,
      message: "Application status updated successfully.",
      application,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Delete Application
export const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found.",
      });
    }

    if (
      req.user.role !== "admin" &&
      application.candidate.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    await application.deleteOne();

    res.status(200).json({
      success: true,
      message: "Application deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
