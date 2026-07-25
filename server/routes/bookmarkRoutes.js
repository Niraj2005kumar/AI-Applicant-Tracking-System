import express from "express";
import {
  bookmarkJob,
  getMyBookmarks,
  removeBookmark,
  toggleFavorite,
} from "../controllers/bookmarkController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();


router.post(
  "/:jobId",
  authMiddleware,
  roleMiddleware("candidate"),
  bookmarkJob
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("candidate"),
  getMyBookmarks
);

router.delete(
  "/:jobId",
  authMiddleware,
  roleMiddleware("candidate"),
  removeBookmark
);

router.patch(
  "/favorite/:jobId",
  authMiddleware,
  roleMiddleware("candidate"),
  toggleFavorite
);

export default router;
