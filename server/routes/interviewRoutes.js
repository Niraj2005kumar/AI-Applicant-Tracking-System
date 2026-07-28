import express from "express";
import {
  scheduleInterview,
  getRecruiterInterviews,
  getCandidateInterviews,
  getSingleInterview,
  updateInterview,
  cancelInterview,
} from "../controllers/interviewController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("recruiter"),
  scheduleInterview
);

router.get(
  "/recruiter",
  authMiddleware,
  roleMiddleware("recruiter"),
  getRecruiterInterviews
);

router.get(
  "/candidate",
  authMiddleware,
  roleMiddleware("candidate"),
  getCandidateInterviews
);

router.get(
  "/:id",
  authMiddleware,
  getSingleInterview
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("recruiter"),
  updateInterview
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("recruiter"),
  cancelInterview
);

export default router;