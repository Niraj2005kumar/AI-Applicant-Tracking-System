import express from "express";
import {
  updateApplicationStatus,
  getApplicationsByStatus,
  getSingleApplication,
  getApplicationStatistics,
} from "../controllers/applicationStatusController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware("recruiter"),
  updateApplicationStatus
);

router.get(
  "/status/:status",
  authMiddleware,
  roleMiddleware("recruiter"),
  getApplicationsByStatus
);

router.get(
  "/statistics",
  authMiddleware,
  roleMiddleware("recruiter"),
  getApplicationStatistics
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("recruiter"),
  getSingleApplication
);

export default router;