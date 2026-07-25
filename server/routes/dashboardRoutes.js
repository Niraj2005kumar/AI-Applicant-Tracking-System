import express from "express";
import { getCandidateDashboard } from "../controllers/dashboardController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/candidate",
  authMiddleware,
  roleMiddleware("candidate"),
  getCandidateDashboard
);

export default router;