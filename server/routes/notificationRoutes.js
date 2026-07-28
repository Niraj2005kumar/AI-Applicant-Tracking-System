import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  deleteNotification,
  getMyNotifications,
  getUnreadCount,
  markAllAsRead,
  markAsRead,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", authMiddleware, getMyNotifications);
router.patch("/:id/read", authMiddleware, markAsRead);
router.patch("/read-all", authMiddleware, markAllAsRead);
router.delete("/:id", authMiddleware, deleteNotification);
router.get("/unread-count", authMiddleware, getUnreadCount);

export default router;
