import express from "express";
import {
  applyForJob,
  getMyApplications,
  getJobApplications,
  withdrawApplication,
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
  getJobApplications
);

router.delete(
  "/withdraw/:id",
  authMiddleware,
  roleMiddleware("candidate"),
  withdrawApplication
);

export default router;