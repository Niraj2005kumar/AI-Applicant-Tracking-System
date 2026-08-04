import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import {
  getResumeAnalysis,
  getJobMatchAnalysis,
  getRecommendedCandidates,
} from "../controllers/atsController.js";

const router = express.Router();

router.get("/resume-analysis", authMiddleware, getResumeAnalysis);
router.get("/job-match/:jobId", authMiddleware, getJobMatchAnalysis);
router.get(
  "/recommended-candidates/:jobId",
  authMiddleware,
  roleMiddleware("recruiter", "admin"),
  getRecommendedCandidates
);

export default router;
