import express from "express";
import {
  applyForJob,
  getMyApplications,
  getApplicationsByJob,
  deleteApplication,
} from "../controllers/applicationController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Apply - supports both POST /apply/:jobId and POST /:jobId
router.post(
  "/apply/:jobId",
  authMiddleware,
  roleMiddleware("candidate"),
  upload.single("resume"),
  applyForJob
);

router.post(
  "/:jobId",
  authMiddleware,
  roleMiddleware("candidate"),
  upload.single("resume"),
  applyForJob
);

// Get Candidate's Applications - supports both /my-applications and /my
router.get(
  "/my-applications",
  authMiddleware,
  roleMiddleware("candidate"),
  getMyApplications
);

router.get(
  "/my",
  authMiddleware,
  roleMiddleware("candidate"),
  getMyApplications
);

// Get applications by Job (Recruiter Only)
router.get(
  "/job/:jobId",
  authMiddleware,
  roleMiddleware("recruiter"),
  getApplicationsByJob
);

// Withdraw Application - supports both DELETE /withdraw/:id and DELETE /:id
router.delete(
  "/withdraw/:id",
  authMiddleware,
  roleMiddleware("candidate"),
  deleteApplication
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("candidate"),
  deleteApplication
);

export default router;