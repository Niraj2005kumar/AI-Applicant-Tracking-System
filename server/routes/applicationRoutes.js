import express from "express";
import {
  applyForJob,
  getMyApplications,
  getApplicationsByJob,
  updateApplicationStatus,
  deleteApplication,
} from "../controllers/applicationController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

// Candidate Apply for Job
router.post(
  "/apply/:jobId",
  authMiddleware,
  authorizeRoles("candidate"),
  applyForJob
);

// Candidate - View Own Applications
router.get(
  "/my",
  authMiddleware,
  authorizeRoles("candidate"),
  getMyApplications
);

// Recruiter/Admin - View Applications for a Job
router.get(
  "/job/:jobId",
  authMiddleware,
  authorizeRoles("recruiter", "admin"),
  getApplicationsByJob
);

// Recruiter/Admin - Update Application Status
router.put(
  "/:id/status",
  authMiddleware,
  authorizeRoles("recruiter", "admin"),
  updateApplicationStatus
);

// Candidate/Admin - Delete Application
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("candidate", "admin"),
  deleteApplication
);

export default router;