import { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { sendResponse } from "../../shared/utils/sendResponse";
import { FollowService } from "./follow.service";
import { AppError } from "../../shared/errors/AppError";

/**
 * ------------------------------------------------
 * Follow Controller
 * ------------------------------------------------
 * Handles HTTP requests for follow/unfollow
 * ------------------------------------------------
 */

export const FollowController = {
  /**
   * ------------------------------------------------
   * Toggle Follow
   * ------------------------------------------------
   * Endpoint:
   * POST /api/users/:userId/follow
   *
   * Flow:
   * 1. Validate authentication
   * 2. Extract target user ID
   * 3. Call FollowService
   * 4. Return follow status
   */
  toggleFollow: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const currentUserId = req.user.id;
    const targetUserId = Number(req.params.userId);

    if (isNaN(targetUserId)) {
      throw new AppError("Invalid user ID", 400);
    }

    const result = await FollowService.toggleFollow(
      currentUserId,
      targetUserId,
    );

    sendResponse(res, 200, "Follow status updated", result);
  }),


  


};
