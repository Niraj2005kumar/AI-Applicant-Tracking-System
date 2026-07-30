import express from "express";
import User from "../models/User.js";
import Company from "../models/Company.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import Interview from "../models/Interview.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Recruiter Profile - GET
router.get(
  "/profile",
  authMiddleware,
  roleMiddleware("recruiter"),
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select("-password");
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found." });
      }
      res.status(200).json({ success: true, user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
);

// Recruiter Profile - PUT
router.put(
  "/profile",
  authMiddleware,
  roleMiddleware("recruiter"),
  async (req, res) => {
    try {
      const { name, phone, location, bio } = req.body;
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found." });
      }

      if (name) user.name = name;
      if (phone !== undefined) user.phone = phone;
      if (location !== undefined) user.location = location;
      if (bio !== undefined) user.bio = bio;

      await user.save();
      res.status(200).json({ success: true, message: "Profile updated successfully.", user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
);

// Recruiter Company - GET
router.get(
  "/company",
  authMiddleware,
  roleMiddleware("recruiter"),
  async (req, res) => {
    try {
      const company = await Company.findOne({ owner: req.user._id });
      if (!company) {
        // Return empty structure instead of failing, to let frontend bind input values safely
        return res.status(200).json({
          name: "",
          website: "",
          industry: "",
          companySize: "1-10",
          location: "",
          founded: "",
          description: "",
          logo: ""
        });
      }
      res.status(200).json(company);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
);

// Recruiter Company - PUT
router.put(
  "/company",
  authMiddleware,
  roleMiddleware("recruiter"),
  upload.single("logo"),
  async (req, res) => {
    try {
      const { name, website, industry, companySize, location, founded, description } = req.body;
      
      let company = await Company.findOne({ owner: req.user._id });
      
      const logoPath = req.file ? `/uploads/${req.file.filename}` : undefined;

      const companyData = {
        name,
        website,
        industry,
        companySize,
        location,
        foundedYear: Number(founded) || undefined,
        description,
      };

      if (logoPath) {
        companyData.logo = logoPath;
      }

      if (company) {
        // Update
        company = await Company.findByIdAndUpdate(company._id, companyData, { new: true });
      } else {
        // Create
        companyData.owner = req.user._id;
        company = await Company.create(companyData);
      }

      res.status(200).json({ success: true, message: "Company profile updated successfully.", company });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
);

// Recruiter Jobs - GET
router.get(
  "/jobs",
  authMiddleware,
  roleMiddleware("recruiter"),
  async (req, res) => {
    try {
      const jobs = await Job.find({ recruiter: req.user._id }).populate("company");
      
      // Calculate applicant counts dynamically
      const jobsWithCounts = await Promise.all(jobs.map(async (job) => {
        const count = await Application.countDocuments({ job: job._id });
        return {
          ...job.toObject(),
          applicantsCount: count
        };
      }));

      res.status(200).json({ success: true, jobs: jobsWithCounts });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
);

// Recruiter Applicants - GET
router.get(
  "/applicants",
  authMiddleware,
  roleMiddleware("recruiter"),
  async (req, res) => {
    try {
      const recruiterJobs = await Job.find({ recruiter: req.user._id }).select("_id");
      const jobIds = recruiterJobs.map((j) => j._id);

      const applications = await Application.find({ job: { $in: jobIds } })
        .populate("candidate", "name email phone skills experience education resume")
        .populate("job", "title");

      // Format applications to candidate details structure expected by frontend
      const list = applications.map((app) => ({
        _id: app._id,
        name: app.candidate?.name || "Candidate",
        email: app.candidate?.email || "",
        phone: app.candidate?.phone || "",
        job: { title: app.job?.title || "Job opening" },
        status: app.status,
        resume: app.resume || app.candidate?.resume || "",
        atsScore: app.atsScore || 0,
        matchPercentage: app.matchPercentage || 0,
        recommendation: app.recommendation || "Neutral"
      }));

      res.status(200).json({ success: true, applicants: list });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
);

// Recruiter Interviews - GET
router.get(
  "/interviews",
  authMiddleware,
  roleMiddleware("recruiter"),
  async (req, res) => {
    try {
      const interviews = await Interview.find({ recruiter: req.user._id })
        .populate("candidate", "name email")
        .populate("job", "title");
      res.status(200).json({ success: true, interviews });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
);

export default router;
