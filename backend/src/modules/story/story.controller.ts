import { Request, Response } from "express";
import { StoryService } from "./story.service";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { sendResponse } from "../../shared/utils/sendResponse";
import { AppError } from "../../shared/errors/AppError";

/**
 * ------------------------------------------------
 * Story Controller
 * ------------------------------------------------
 * Handles HTTP requests for story-related features.
 *
 * Responsibilities:
 * - Upload story
 * - Fetch active stories
 * - Mark story as viewed
 *
 * Story rules:
 * - Image only
 * - Automatically expires after 24 hours
 */

export const StoryController = {
  /**
   * ------------------------------------------------
   * Create Story
   * ------------------------------------------------
   * Endpoint:
   * POST /api/stories
   *
   * Request:
   * multipart/form-data
   *
   * Fields:
   * image → story image
   */
  createStory: asyncHandler(async (req: Request, res: Response) => {
    const user = req.user;

    if (!user) {
      throw new AppError("Unauthorized", 401);
    }

    const file = req.file;

    /**
     * Ensure image is uploaded
     */
    if (!file) {
      throw new AppError("Story image is required", 400);
    }

    /**
     * Build public image URL
     */
    const folder = `${user.username}_${user.id}`;

    const imageUrl = `/uploads/users/${folder}/stories/${file.filename}`;

    /**
     * Create story in database
     */
    const story = await StoryService.createStory(user.id, imageUrl);

    sendResponse(res, 201, "Story created successfully", story);
  }),

  /**
   * ------------------------------------------------
   * Get Stories
   * ------------------------------------------------
   * Endpoint:
   * GET /api/stories
   *
   * Returns all active stories
   * (stories created within last 24 hours)
   */
  getStories: asyncHandler(async (req: Request, res: Response) => {
    const stories = await StoryService.getStories();

    sendResponse(res, 200, "Stories fetched successfully", stories);
  }),

  /**
   * ------------------------------------------------
   * View Story
   * ------------------------------------------------
   * Endpoint:
   * POST /api/stories/:id/view
   *
   * Records that a user viewed the story
   */
  viewStory: asyncHandler(async (req: Request, res: Response) => {
    const user = req.user;

    if (!user) {
      throw new AppError("Unauthorized", 401);
    }

    const storyId = Number(req.params.id);

    const result = await StoryService.viewStory(storyId, user.id);

    sendResponse(res, 200, "Story viewed successfully", result);
  }),
};
