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
   * Get user profile
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
    const userId = req.user!.id;

    const updatedUser = await UserService.updateProfile(userId, req.body);

    sendResponse(res, 200, "Profile updated successfully", updatedUser);
  }),

  /**
   * ------------------------------------------------
   * Update profile avatar
   * ------------------------------------------------
   */

  updateAvatar: asyncHandler(async (req: Request, res: Response) => {
    const user = req.user!;

    if (!req.file) {
      throw new AppError("Avatar image required", 400);
    }

    
    const folder = `${user.username}_${user.id}`;

    const imageUrl = `/uploads/users/${folder}/avatars/${req.file.filename}`;

    const updatedUser = await UserService.updateAvatar(user.id, imageUrl);

    sendResponse(res, 200, "Avatar updated successfully", updatedUser);
  }),

  /**
   * ------------------------------------------------
   * Update cover photo
   * ------------------------------------------------
   */

  updateCover: asyncHandler(async (req: Request, res: Response) => {
    const user = req.user!;

    if (!req.file) {
      throw new AppError("Cover image required", 400);
    }

    const folder = `${user.username}_${user.id}`;

    const imageUrl = `/uploads/users/${folder}/covers/${req.file.filename}`;

    const updatedUser = await UserService.updateCover(user.id, imageUrl);

    sendResponse(res, 200, "Cover photo updated successfully", updatedUser);
  }),
};
