import express from "express";
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

// Public Routes
router.get("/", getAllJobs);
router.get("/:id", getJobById);

// Recruiter & Admin Only
router.post(
  "/",
  authMiddleware,
  authorizeRoles("recruiter", "admin"),
  createJob
);

router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("recruiter", "admin"),
  updateJob
);

router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("recruiter", "admin"),
  deleteJob
);

export default router;