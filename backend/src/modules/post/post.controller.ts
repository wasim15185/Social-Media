import { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { sendResponse } from "../../shared/utils/sendResponse";
import { PostService } from "./post.service";
import { AppError } from "../../shared/errors/AppError";

/**
 * Post Controller
 */

export const PostController = {
  /**
   * Create post
   */
  createPost: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }
    const userId = req.user.id;

    const files = req.files as Express.Multer.File[];

    const images = files?.map((file) => file.path) || [];

    const post = await PostService.createPost(
      userId!,
      req.body.content,
      images,
    );

    sendResponse(res, 201, "Post created successfully", post);
  }),

  /**
   * Update post controller
   *
   * Allows the post owner to edit the post content.
   */

  updatePost: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const postId = Number(req.params.id);

    const post = await PostService.updatePost(postId, userId, req.body);

    sendResponse(res, 200, "Post updated successfully", post);
  }),

  /**
   * Get feed with pagination
   *
   * Query parameters:
   * page  -> page number
   * limit -> number of posts per page
   *
   * Example:
   * /api/posts/feed?page=1&limit=10
   */

  getFeed: asyncHandler(async (req: Request, res: Response) => {
    /**
     * Extract pagination parameters
     */
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const posts = await PostService.getFeed(page, limit);

    sendResponse(res, 200, "Feed fetched successfully", posts);
  }),

  /**
   * Get single post
   */
  getPost: asyncHandler(async (req: Request, res: Response) => {
    const postId = Number(req.params.id);

    const post = await PostService.getPostById(postId);

    sendResponse(res, 200, "Post fetched successfully", post);
  }),

  /**
   * Delete post
   */
  deletePost: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }
    const userId = req.user.id;

    const postId = Number(req.params.id);

    await PostService.deletePost(postId, userId);

    sendResponse(res, 200, "Post deleted successfully");
  }),
};
