import Application from "../models/Application.js";
import Job from "../models/Job.js";
import User from "../models/User.js";
import { parseResumeForCandidate } from "../services/resumeParserService.js";
import { buildAtsAnalysis } from "../services/atsScoringService.js";

export const getResumeAnalysis = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const analysis = await parseResumeForCandidate({
      resumePath: user.resume,
      userProfile: user,
    });

    res.status(200).json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getJobMatchAnalysis = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found." });
    }

    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const analysis = await parseResumeForCandidate({
      resumePath: user.resume,
      userProfile: user,
    });

    const score = buildAtsAnalysis({
      candidateProfile: {
        ...analysis.parsedResume,
        skills: analysis.parsedResume.skills,
        experience: analysis.parsedResume.experience,
        education: analysis.parsedResume.education,
        keywords: analysis.parsedResume.keywords,
      },
      job,
    });

    res.status(200).json({
      success: true,
      job,
      analysis,
      score,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getRecommendedCandidates = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found." });
    }

    const applications = await Application.find({ job: jobId })
      .populate("candidate", "name email skills experience education resume")
      .sort({ atsScore: -1, matchPercentage: -1 });

    const rankedCandidates = applications.map((application) => {
      const candidate = application.candidate || {};
      const parsed = {
        skills: candidate.skills || [],
        experience: candidate.experience || 0,
        education: candidate.education || "",
        keywords: [],
      };

      const score = buildAtsAnalysis({ candidateProfile: parsed, job });

      return {
        applicationId: application._id,
        candidateId: candidate._id,
        candidateName: candidate.name,
        candidateEmail: candidate.email,
        status: application.status,
        atsScore: score.atsScore,
        matchPercentage: score.matchPercentage,
        recommendation: score.recommendation,
        missingSkills: score.missingSkills,
      };
    });

    res.status(200).json({ success: true, rankedCandidates });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
