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
 * Multer Storage Configuration
 * ------------------------------------------------
 * Stores user files in:
 * uploads/users/{username_id}/avatars
 * uploads/users/{username_id}/covers
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const user = req.user!;
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
 *   description: User profile, follow system, and social APIs
 */

/**
 * ------------------------------------------------
 * Get All Users
 * ------------------------------------------------
 */
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (with follow status)
 *     description: |
 *       Returns all users except the authenticated user.
 *       Includes follow status (isFollowing).
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: false
 *         schema:
 *           type: string
 *         example: rahul
 *     responses:
 *       200:
 *         description: Users fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               [
 *                 {
 *                   "id": 2,
 *                   "username": "rahul",
 *                   "profileImage": "/uploads/users/rahul_2/avatars/avatar.jpg",
 *                   "coverImage": "/uploads/users/rahul_2/covers/cover.jpg",
 *                   "bio": "Frontend Developer",
 *                   "isFollowing": true
 *                 }
 *               ]
 *       401:
 *         description: Unauthorized
 */
router.get("/", authMiddleware, UserController.getAllUsers);

/**
 * ------------------------------------------------
 * Get Following Users
 * ------------------------------------------------
 */
/**
 * @swagger
 * /users/following:
 *   get:
 *     summary: Get users I follow
 *     description: Returns all users that the current user is following
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Following users fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               [
 *                 {
 *                   "id": 3,
 *                   "username": "amit",
 *                   "profileImage": "/uploads/users/amit_3/avatars/avatar.jpg",
 *                   "coverImage": "/uploads/users/amit_3/covers/cover.jpg",
 *                   "bio": "Backend Developer",
 *                   "isFollowing": true
 *                 }
 *               ]
 */
router.get("/following", authMiddleware, UserController.getFollowing);

/**
 * ------------------------------------------------
 * Get Followers
 * ------------------------------------------------
 */
/**
 * @swagger
 * /users/followers:
 *   get:
 *     summary: Get users who follow me
 *     description: Returns all users who are following the authenticated user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Followers fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               [
 *                 {
 *                   "id": 5,
 *                   "username": "soumya",
 *                   "profileImage": "/uploads/users/soumya_5/avatars/avatar.jpg",
 *                   "coverImage": "/uploads/users/soumya_5/covers/cover.jpg",
 *                   "bio": "UI Designer",
 *                   "isFollowing": false
 *                 }
 *               ]
 */
router.get("/followers", authMiddleware, UserController.getFollowers);

/**
 * ------------------------------------------------
 * Get Saved Posts
 * ------------------------------------------------
 */
/**
 * @swagger
 * /users/saved-posts:
 *   get:
 *     summary: Get saved posts
 *     description: Returns posts saved by the authenticated user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 */
router.get("/saved-posts", authMiddleware, SavedPostController.getSavedPosts);

/**
 * ------------------------------------------------
 * Update Profile
 * ------------------------------------------------
 */
/**
 * @swagger
 * /users/profile:
 *   patch:
 *     summary: Update profile details
 *     description: Update user bio or other profile fields
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             {
 *               "bio": "Full Stack Developer"
 *             }
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.patch(
  "/profile",
  authMiddleware,
  validateRequest(updateProfileSchema),
  UserController.updateProfile,
);

/**
 * ------------------------------------------------
 * Update Avatar
 * ------------------------------------------------
 */
/**
 * @swagger
 * /users/avatar:
 *   patch:
 *     summary: Upload profile avatar
 *     description: Upload a new profile image
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - avatar
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar updated successfully
 */
router.patch(
  "/avatar",
  authMiddleware,
  upload.single("avatar"),
  UserController.updateAvatar,
);

/**
 * ------------------------------------------------
 * Update Cover Image
 * ------------------------------------------------
 */
/**
 * @swagger
 * /users/cover:
 *   patch:
 *     summary: Upload cover image
 *     description: Upload a new cover image
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - cover
 *             properties:
 *               cover:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Cover updated successfully
 */
router.patch(
  "/cover",
  authMiddleware,
  upload.single("cover"),
  UserController.updateCover,
);

/**
 * ------------------------------------------------
 * Get Single User Profile
 * ------------------------------------------------
 */
/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user profile by ID
 *     description: Returns user profile with posts
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 *       404:
 *         description: User not found
 */
router.get("/:id", UserController.getProfile);

export default router;
