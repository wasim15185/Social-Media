import express from "express";
import { TrendingController } from "./trending.controller";

const router = express.Router();

/**
 * @swagger
 * /trending/hashtags:
 *   get:
 *     summary: Get trending hashtags
 *     tags: [Trending]
 *     parameters:
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           example: 10
 *       - name: days
 *         in: query
 *         schema:
 *           type: integer
 *           example: 2
 *     responses:
 *       200:
 *         description: Trending hashtags fetched successfully
 */
router.get("/hashtags", TrendingController.getTrendingHashtags);

export default router;
