import { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { sendResponse } from "../../shared/utils/sendResponse";
import { UserService } from "./user.service";

/**
 * User Controller
 */

export const UserController = {
  /**
   * Get profile
   */
  getProfile: asyncHandler(async (req: Request, res: Response) => {
    const userId = Number(req.params.id);

    const user = await UserService.getUserProfile(userId);

    sendResponse(res, 200, "User profile fetched successfully", user);
  }),

  /**
   * Update profile
   */
  updateProfile: asyncHandler(async (req: Request, res: Response) => {
    const userId = Number(req.user.id);

    const updatedUser = await UserService.updateProfile(userId, req.body);

    sendResponse(res, 200, "Profile updated successfully", updatedUser);
  }),
};
