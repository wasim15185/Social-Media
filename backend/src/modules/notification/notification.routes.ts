import express from "express";
import { NotificationController } from "./notification.controller";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: User notification APIs
 */

/**
 * @swagger
 * /users/notifications:
 *   get:
 *     summary: Get user notifications
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 */
router.get(
  "/notifications",
  authMiddleware,
  NotificationController.getNotifications,
);

/**
 * @swagger
 * /notifications/{id}/read:
 *   patch:
 *     summary: Mark notification as read
 *     tags: [Notifications]
 *     security:
 *       - BearerAuth: []
 */
router.patch(
  "/notifications/:id/read",
  authMiddleware,
  NotificationController.markAsRead,
);

export default router;
