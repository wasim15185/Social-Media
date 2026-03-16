import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import { StoryController } from "./story.controller";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";

const router = express.Router();

/**
 * ------------------------------------------------
 * Multer Storage Configuration
 * ------------------------------------------------
 * Stories will be stored in:
 *
 * uploads/users/{username_userid}/stories
 *
 * Example:
 * uploads/users/wasim_31/stories/1712456-story.jpg
 */

const storage = multer.diskStorage({
  destination: (req: any, file, cb) => {
    const user = req.user;

    const folderName = `${user.username}_${user.id}`;

    const uploadPath = path.join(
      process.cwd(),
      "uploads",
      "users",
      folderName,
      "stories",
    );

    /**
     * Ensure folder exists
     */
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },

  /**
   * Unique filename
   */
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname.replace(/\s/g, "_");

    cb(null, uniqueName);
  },
});

/**
 * Multer instance
 */
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

/**
 * ------------------------------------------------
 * Swagger Tags
 * ------------------------------------------------
 */

/**
 * @swagger
 * tags:
 *   name: Stories
 *   description: APIs for managing image stories (24-hour expiry)
 */

/**
 * ------------------------------------------------
 * Create Story
 * ------------------------------------------------
 */

/**
 * @swagger
 * /stories:
 *   post:
 *     summary: Upload a new story
 *     description: Upload a story image that expires after 24 hours
 *     tags: [Stories]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Story created successfully
 */

router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  StoryController.createStory,
);

/**
 * ------------------------------------------------
 * Get Stories
 * ------------------------------------------------
 */

/**
 * @swagger
 * /stories:
 *   get:
 *     summary: Fetch active stories
 *     description: Returns stories that have not expired (24 hours)
 *     tags: [Stories]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Stories fetched successfully
 */

router.get("/", authMiddleware, StoryController.getStories);

/**
 * ------------------------------------------------
 * View Story
 * ------------------------------------------------
 */

/**
 * @swagger
 * /stories/{id}/view:
 *   post:
 *     summary: Mark story as viewed
 *     description: Marks a story as viewed by the authenticated user
 *     tags: [Stories]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Story ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Story viewed successfully
 */

router.post("/:id/view", authMiddleware, StoryController.viewStory);

export default router;
