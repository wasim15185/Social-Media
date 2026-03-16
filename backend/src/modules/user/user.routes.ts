import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import { UserController } from "./user.controller";
import { validateRequest } from "../../shared/middlewares/validateRequest";
import { updateProfileSchema } from "./user.dto";
import { SavedPostController } from "../post/saved-post/savedPost.controller";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";

const router = express.Router();

/**
 * ------------------------------------------------
 * Multer storage for profile images
 * ------------------------------------------------
 */

const storage = multer.diskStorage({
  destination: (req: any, file, cb) => {
    const user = req.user;

    const folder = `${user.username}_${user.id}`;

    const uploadPath = path.join(
      process.cwd(),
      "uploads",
      "users",
      folder,
      file.fieldname === "avatar" ? "avatars" : "covers",
    );

    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname.replace(/\s/g, "_");

    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile APIs
 */

/**
 * ------------------------------------------------
 * Get user profile
 * ------------------------------------------------
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 */

router.get("/:id", UserController.getProfile);

/**
 * ------------------------------------------------
 * Update profile info
 * ------------------------------------------------
 */

/**
 * @swagger
 * /users/profile:
 *   patch:
 *     summary: Update user profile info
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 */

router.patch(
  "/profile",
  authMiddleware,
  validateRequest(updateProfileSchema),
  UserController.updateProfile,
);

/**
 * ------------------------------------------------
 * Upload avatar
 * ------------------------------------------------
 */

/**
 * @swagger
 * /users/avatar:
 *   patch:
 *     summary: Update profile picture
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 */

router.patch(
  "/avatar",
  authMiddleware,
  upload.single("avatar"),
  UserController.updateAvatar,
);

/**
 * ------------------------------------------------
 * Upload cover photo
 * ------------------------------------------------
 */

/**
 * @swagger
 * /users/cover:
 *   patch:
 *     summary: Update cover photo
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 */

router.patch(
  "/cover",
  authMiddleware,
  upload.single("cover"),
  UserController.updateCover,
);

/**
 * ------------------------------------------------
 * Get saved posts
 * ------------------------------------------------
 */

router.get("/saved-posts", authMiddleware, SavedPostController.getSavedPosts);

export default router;
