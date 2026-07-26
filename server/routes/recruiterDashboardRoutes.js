import express from "express";
import {
  getRecruiterDashboard,
  getJobStatistics,
  getRecentApplications,
  getTopJobs,
} from "../controllers/recruiterDashboardController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/recruiter",
  authMiddleware,
  roleMiddleware("recruiter"),
  getRecruiterDashboard
);

router.get(
  "/job-stats",
  authMiddleware,
  roleMiddleware("recruiter"),
  getJobStatistics
);

router.get(
  "/recent-applications",
  authMiddleware,
  roleMiddleware("recruiter"),
  getRecentApplications
);

router.get(
  "/top-jobs",
  authMiddleware,
  roleMiddleware("recruiter"),
  getTopJobs
);

export default router;