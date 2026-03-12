import express from "express";
import { SavedPostController } from "./savedPost.controller";
import { authMiddleware } from "../../../shared/middlewares/auth.middleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: SavedPosts
 *   description: Save and manage bookmarked posts
 */

/**
 * @swagger
 * /posts/{postId}/save:
 *   post:
 *     summary: Save or unsave a post
 *     description: Toggle save status for a post.
 *     tags: [SavedPosts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         description: Post ID
 *         schema:
 *           type: integer
 */
router.post(
  "/:postId/save",
  authMiddleware,
  SavedPostController.toggleSavePost,
);

/**
 * @swagger
 * /users/saved-posts:
 *   get:
 *     summary: Get saved posts
 *     description: Returns posts saved by the authenticated user.
 *     tags: [SavedPosts]
 *     security:
 *       - BearerAuth: []
 */
router.get("/saved-posts", authMiddleware, SavedPostController.getSavedPosts);

export default router;
