import express from "express";
import { FollowController } from "./follow.controller";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";

const router = express.Router();

/**
 * ------------------------------------------------
 * Swagger Documentation
 * ------------------------------------------------
 */

/**
 * @swagger
 * tags:
 *   name: Follow
 *   description: Follow / Unfollow APIs
 */

/**
 * @swagger
 * /users/{userId}/follow:
 *   post:
 *     summary: Follow or unfollow a user
 *     description: Toggles follow status between authenticated user and target user.
 *     tags: [Follow]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: Target user ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Follow status updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 following:
 *                   type: boolean
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.post("/:userId/follow", authMiddleware, FollowController.toggleFollow);

export default router;
