import { Request, Response } from "express";
import { StoryService } from "./story.service";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { sendResponse } from "../../shared/utils/sendResponse";

/**
 * Story Controller
 */

export const StoryController = {
  /**
   * Create story
   */
  createStory: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const file = req.file;

    if (!file) {
      throw new Error("Image required");
    }

    const imageUrl = `/uploads/stories/${file.filename}`;

    const story = await StoryService.createStory(userId, imageUrl);

    sendResponse(res, 201, "Story created", story);
  }),

  /**
   * Get stories
   */
  getStories: asyncHandler(async (req: Request, res: Response) => {
    const stories = await StoryService.getStories();

    sendResponse(res, 200, "Stories fetched", stories);
  }),

  /**
   * View story
   */
  viewStory: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const storyId = Number(req.params.id);

    const result = await StoryService.viewStory(storyId, userId);

    sendResponse(res, 200, "Story viewed", result);
  }),
};
