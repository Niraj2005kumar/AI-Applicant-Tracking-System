import express from "express";
import {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
} from "../controllers/companyController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", getAllCompanies);

router.get("/:id", getCompanyById);

router.post(
  "/",
  authMiddleware,
  roleMiddleware("recruiter", "admin"),
  createCompany
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("recruiter", "admin"),
  updateCompany
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("recruiter", "admin"),
  deleteCompany
);

export default router;