import express from "express";
import { SearchController } from "./search.controller";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Search
 *   description: Search users and posts
 */

/**
 * @swagger
 * /search/users:
 *   get:
 *     summary: Search users by username
 *     tags: [Search]
 *     parameters:
 *       - name: q
 *         in: query
 *         required: true
 *         description: Search query
 *         schema:
 *           type: string
 *           example: rahul
 *     responses:
 *       200:
 *         description: Users found
 */
router.get("/users",authMiddleware, SearchController.searchUsers);

/**
 * @swagger
 * /search/posts:
 *   get:
 *     summary: Search posts by content
 *     tags: [Search]
 *     parameters:
 *       - name: q
 *         in: query
 *         required: true
 *         description: Search query
 *         schema:
 *           type: string
 *           example: travel
 *     responses:
 *       200:
 *         description: Posts found
 */
router.get("/posts", authMiddleware, SearchController.searchPosts);

export default router;
