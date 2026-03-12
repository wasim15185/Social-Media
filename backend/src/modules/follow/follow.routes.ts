import express from "express";
import { FollowController } from "./follow.controller";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Follow
 *   description: User follow APIs
 */

/**
 * @swagger
 * /users/{userId}/follow:
 *   post:
 *     summary: Follow or unfollow a user
 *     tags: [Follow]
 *     security:
 *       - BearerAuth: []
 */
router.post("/:userId/follow", authMiddleware, FollowController.toggleFollow);

export default router;
