import express from "express";
import multer from "multer";
import { StoryController } from "./story.controller";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";

const router = express.Router();

/**
 * Multer Storage Configuration
 */
const storage = multer.diskStorage({
  destination: "uploads/stories",
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

/**
 * @swagger
 * tags:
 *   name: Stories
 *   description: Story APIs (24 hour image stories)
 */

/**
 * @swagger
 * /stories:
 *   post:
 *     summary: Create a story
 *     description: Upload a story image. Story expires after 24 hours.
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
 * @swagger
 * /stories:
 *   get:
 *     summary: Get stories
 *     description: Fetch all active stories (not expired).
 *     tags: [Stories]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Stories fetched successfully
 */
router.get("/", authMiddleware, StoryController.getStories);

/**
 * @swagger
 * /stories/{id}/view:
 *   post:
 *     summary: View story
 *     description: Mark a story as viewed by the current user.
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
 *         description: Story marked as viewed
 */
router.post("/:id/view", authMiddleware, StoryController.viewStory);

export default router;
