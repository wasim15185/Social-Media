import express from "express";
import { LikeController } from "./like.controller";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Likes
 *   description: Post like APIs
 */

/**
 * @swagger
 * /likes/{postId}:
 *   post:
 *     summary: Like or unlike a post
 *     tags: [Likes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 */
router.post("/:postId", authMiddleware, LikeController.toggleLike);

export default router;
