import express from "express";
import User from "../models/User.js";
import Company from "../models/Company.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// GET Admin Dashboard Stats
router.get("/stats", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "candidate" });
    const totalRecruiters = await User.countDocuments({ role: "recruiter" });
    const totalJobs = await Job.countDocuments();
    const totalCompanies = await Company.countDocuments();
    const totalApplications = await Application.countDocuments();

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalRecruiters,
        totalJobs,
        totalCompanies,
        totalApplications
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// GET Users list
router.get("/users", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// DELETE User
router.delete("/users/:id", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "User deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// GET Companies list
router.get("/companies", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const companies = await Company.find().populate("owner", "name email").sort({ createdAt: -1 });
    res.status(200).json({ success: true, companies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// DELETE Company
router.delete("/companies/:id", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    await Company.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Company deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// GET Jobs list
router.get("/jobs", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const jobs = await Job.find().populate("company").populate("recruiter", "name email").sort({ createdAt: -1 });
    res.status(200).json({ success: true, jobs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// DELETE Job
router.delete("/jobs/:id", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Job deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

export default router;
