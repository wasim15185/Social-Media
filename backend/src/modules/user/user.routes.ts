import express from "express";
import { UserController } from "./user.controller";
import { validateRequest } from "../../shared/middlewares/validateRequest";
import { updateProfileSchema } from "./user.dto";
import { SavedPostController } from "../post/saved-post/savedPost.controller";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile APIs
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 */
router.get("/:id", UserController.getProfile);

/**
 * @swagger
 * /users/profile:
 *   patch:
 *     summary: Update profile
 *     tags: [Users]
 */
router.patch(
  "/profile",
  validateRequest(updateProfileSchema),
  UserController.updateProfile,
);

/**
 * @swagger
 * /users/saved-posts:
 *   get:
 *     summary: Get saved posts of current user
 *     description: Returns posts that the authenticated user has saved/bookmarked.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Saved posts fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/saved-posts",
  authMiddleware,
  SavedPostController.getSavedPosts
);

export default router;
