import { Request, Response } from "express";
import { asyncHandler } from "../../../shared/utils/asyncHandler";
import { sendResponse } from "../../../shared/utils/sendResponse";
import { SavedPostService } from "./savedPost.service";

/**
 * Saved Post Controller
 */

export const SavedPostController = {
  /**
   * Save or unsave post
   */
  toggleSavePost: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const postId = Number(req.params.postId);

    const result = await SavedPostService.toggleSavePost(userId, postId);

    sendResponse(res, 200, "Saved post updated", result);
  }),

  /**
   * Get saved posts
   */
  getSavedPosts: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const posts = await SavedPostService.getSavedPosts(userId);

    sendResponse(res, 200, "Saved posts fetched", posts);
  }),
};
