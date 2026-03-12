import express from "express";
import { CommentController } from "./comment.controller";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";
import { validateRequest } from "../../shared/middlewares/validateRequest";
import { createCommentSchema } from "./comment.dto";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: APIs for managing comments on posts
 */

/**
 * @swagger
 * /posts/{postId}/comments:
 *   post:
 *     summary: Create a comment on a post
 *     description: Allows an authenticated user to add a comment to a specific post.
 *     tags: [Comments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         description: ID of the post to comment on
 *         schema:
 *           type: integer
 *           example: 5
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: This is a great post!
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Post not found
 */
router.post(
  "/:postId/comments",
  authMiddleware,
  validateRequest(createCommentSchema),
  CommentController.createComment,
);

/**
 * @swagger
 * /posts/{postId}/comments:
 *   get:
 *     summary: Get comments for a post
 *     description: Retrieve all comments associated with a specific post.
 *     tags: [Comments]
 *     parameters:
 *       - name: postId
 *         in: path
 *         required: true
 *         description: ID of the post
 *         schema:
 *           type: integer
 *           example: 5
 *     responses:
 *       200:
 *         description: Comments fetched successfully
 */
router.get("/:postId/comments", CommentController.getComments);

/**
 * @swagger
 * /posts/comments/{id}:
 *   delete:
 *     summary: Delete a comment
 *     description: Allows the comment owner to delete their comment.
 *     tags: [Comments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Comment ID
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Comment not found
 */
router.delete("/comments/:id", authMiddleware, CommentController.deleteComment);

export default router;
