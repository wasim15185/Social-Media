import { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { sendResponse } from "../../shared/utils/sendResponse";
import { UserService } from "./user.service";
import { AppError } from "../../shared/errors/AppError";

/**
 * ------------------------------------------------
 * User Controller
 * ------------------------------------------------
 * Handles all HTTP requests related to user profiles
 */
export const UserController = {
  /**
   * ------------------------------------------------
   * Get user profile by ID
   * ------------------------------------------------
   */
  getProfile: asyncHandler(async (req: Request, res: Response) => {
    const userId = Number(req.params.id);

    const user = await UserService.getUserProfile(userId);

    sendResponse(res, 200, "User profile fetched successfully", user);
  }),

  /**
   * ------------------------------------------------
   * Update profile details
   * ------------------------------------------------
   */
  updateProfile: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const updatedUser = await UserService.updateProfile(req.user.id, req.body);

    sendResponse(res, 200, "Profile updated successfully", updatedUser);
  }),

  /**
   * ------------------------------------------------
   * Update profile avatar
   * ------------------------------------------------
   */
  updateAvatar: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Unauthorized", 401);

    if (!req.file) {
      throw new AppError("Avatar image required", 400);
    }

    const folder = `${req.user.username}_${req.user.id}`;

    const imageUrl = `/uploads/users/${folder}/avatars/${req.file.filename}`;

    const updatedUser = await UserService.updateAvatar(req.user.id, imageUrl);

    sendResponse(res, 200, "Avatar updated successfully", updatedUser);
  }),

  /**
   * ------------------------------------------------
   * Update cover photo
   * ------------------------------------------------
   */
  updateCover: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Unauthorized", 401);

    if (!req.file) {
      throw new AppError("Cover image required", 400);
    }

    const folder = `${req.user.username}_${req.user.id}`;

    const imageUrl = `/uploads/users/${folder}/covers/${req.file.filename}`;

    const updatedUser = await UserService.updateCover(req.user.id, imageUrl);

    sendResponse(res, 200, "Cover photo updated successfully", updatedUser);
  }),

  /**
   * ------------------------------------------------
   * Get all users (search + follow status)
   * ------------------------------------------------
   */
  getAllUsers: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const query = (req.query.q as string) || "";

    const users = await UserService.getAllUsers(req.user.id, query);

    sendResponse(res, 200, "Users fetched successfully", users);
  }),

  /**
   * ------------------------------------------------
   * Get following users
   * ------------------------------------------------
   */
  getFollowing: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Unauthorized", 401);

    const users = await UserService.getFollowingUsers(req.user.id);

    sendResponse(res, 200, "Following users fetched successfully", users);
  }),

  /**
   * ------------------------------------------------
   * Get followers
   * ------------------------------------------------
   */
  getFollowers: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw new AppError("Unauthorized", 401);

    const users = await UserService.getFollowers(req.user.id);

    sendResponse(res, 200, "Followers fetched successfully", users);
  }),
};