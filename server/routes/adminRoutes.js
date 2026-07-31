import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Company from "../models/Company.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import Interview from "../models/Interview.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// GET Admin Dashboard Stats
router.get("/stats", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCandidates = await User.countDocuments({ role: "candidate" });
    const totalRecruiters = await User.countDocuments({ role: "recruiter" });
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalJobs = await Job.countDocuments();
    const totalActiveJobs = await Job.countDocuments({ isActive: true });
    const totalCompanies = await Company.countDocuments();
    const totalApplications = await Application.countDocuments();
    const totalInterviews = await Interview.countDocuments();

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalCandidates,
        totalRecruiters,
        totalAdmins,
        totalJobs,
        totalActiveJobs,
        totalCompanies,
        totalApplications,
        totalInterviews
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// GET All Applications (Admin)
router.get("/applications", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("candidate", "name email phone profileImage resume skills experience education location bio")
      .populate({
        path: "job",
        select: "title location salary jobType isActive company",
        populate: {
          path: "company",
          select: "name logo location industry",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: applications.length, applications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// GET All Interviews (Admin)
router.get("/interviews", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const interviews = await Interview.find()
      .populate("candidate", "name email phone profileImage")
      .populate("recruiter", "name email")
      .populate("company", "name logo location")
      .populate("job", "title location salary jobType")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: interviews.length, interviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// PUT Admin Profile
router.put("/profile", authMiddleware, roleMiddleware("admin"), async (req, res) => {
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

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
        bio: user.bio,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// PUT Admin Password
router.put("/password", authMiddleware, roleMiddleware("admin"), async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long.",
      });
    }

    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully.",
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
