import express from "express";
import { PostController } from "./post.controller";
import { validateRequest } from "../../shared/middlewares/validateRequest";
import { createPostSchema, updatePostSchema } from "./post.dto";
import { uploadPostImages } from "../../shared/middlewares/upload.middleware";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";
import { SavedPostController } from "./saved-post/savedPost.controller";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Social media post APIs
 */

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Create a new post
 *     description: Allows an authenticated user to create a post with optional images.
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: My first post!
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Post created successfully
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/",
  authMiddleware,
  uploadPostImages.array("images", 5),
  validateRequest(createPostSchema),
  PostController.createPost,
);

/**
 * @swagger
 * /posts/feed:
 *   get:
 *     summary: Get feed posts with pagination
 *     description: Returns paginated list of posts for the social media feed.
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: [] 
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         description: Page number
 *         schema:
 *           type: integer
 *           example: 1
 *       - name: limit
 *         in: query
 *         required: false
 *         description: Number of posts per page
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Feed fetched successfully
 */
router.get("/feed", authMiddleware, PostController.getFeed);

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get single post
 *     description: Fetch a single post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Post ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Post fetched successfully
 *       404:
 *         description: Post not found
 */
router.get("/:id", PostController.getPost);


/**
 * @swagger
 * /posts/{id}:
 *   patch:
 *     summary: Update a post
 *     description: Allows the post owner to edit the post content.
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Post ID
 *         schema:
 *           type: integer
 *           example: 5
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: Updated post caption
 *     responses:
 *       200:
 *         description: Post updated successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Post not found
 */
router.patch(
  "/:id",
  authMiddleware,
  validateRequest(updatePostSchema),
  PostController.updatePost
);

/**
 * @swagger
 * /posts/{postId}/save:
 *   post:
 *     summary: Save or unsave a post
 *     tags: [SavedPosts]
 *     security:
 *       - BearerAuth: []
 */
router.post(
  "/:postId/save",
  authMiddleware,
  SavedPostController.toggleSavePost
);

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete post
 *     description: Delete a post owned by the authenticated user
 *     tags: [Posts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Post ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Post deleted successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Post not found
 */
router.delete("/:id", authMiddleware, PostController.deletePost);

export default router;
