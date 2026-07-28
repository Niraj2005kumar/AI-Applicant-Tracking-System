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

router.post(
  "/apply/:jobId",
  authMiddleware,
  roleMiddleware("candidate"),
  upload.single("resume"),
  applyForJob
);

router.get(
  "/my-applications",
  authMiddleware,
  roleMiddleware("candidate"),
  getMyApplications
);

router.get(
  "/job/:jobId",
  authMiddleware,
  roleMiddleware("recruiter"),
  getApplicationsByJob
);

router.delete(
  "/withdraw/:id",
  authMiddleware,
  roleMiddleware("candidate"),
  deleteApplication
);

export default router;