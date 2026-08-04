import express from "express";
import {
  uploadResume,
  getUserProfile,
  extractResumeTextController,
  parseResumeController,
  deleteResume,
} from "../controllers/userController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Get Logged-in User Profile
router.get(
  "/profile",
  authMiddleware,
  getUserProfile
);

// Upload Resume (Candidate Only)
router.put(
  "/upload-resume",
  authMiddleware,
  authorizeRoles("candidate"),
  upload.single("resume"),
  uploadResume
);

// Extract Resume Text (Candidate Only)
router.get(
  "/extract-resume-text",
  authMiddleware,
  authorizeRoles("candidate"),
  extractResumeTextController
);

// Parse Resume Text (Candidate Only)
router.get(
  "/parse-resume",
  authMiddleware,
  authorizeRoles("candidate"),
  parseResumeController
);

// Delete Resume (Candidate Only)
router.delete(
  "/delete-resume",
  authMiddleware,
  authorizeRoles("candidate"),
  deleteResume
);

export default router;