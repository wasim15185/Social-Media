import { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { sendResponse } from "../../shared/utils/sendResponse";
import { FollowService } from "./follow.service";
import { AppError } from "../../shared/errors/AppError";

/**
 * Follow Controller
 */

export const FollowController = {
  toggleFollow: asyncHandler(async (req: Request, res: Response) => {

    if (!req.user) {
          throw new AppError("Unauthorized", 401);
    }

    const currentUserId = req.user.id;
    const targetUserId = Number(req.params.userId);

    const result = await FollowService.toggleFollow(
      currentUserId,
      targetUserId,
    );

    sendResponse(res, 200, "Follow status updated", result);
  }),
};
