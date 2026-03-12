import { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { sendResponse } from "../../shared/utils/sendResponse";
import { LikeService } from "./like.service";

/**
 * Like Controller
 */

export const LikeController = {
  toggleLike: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const postId = Number(req.params.postId);

    const result = await LikeService.toggleLike(postId, userId);

    sendResponse(res, 200, "Like updated", result);
  }),
};
