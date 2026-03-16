import { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { sendResponse } from "../../shared/utils/sendResponse";
import { PostService } from "./post.service";
import { AppError } from "../../shared/errors/AppError";

/**
 * ------------------------------------------------
 * Post Controller
 * ------------------------------------------------
 * Handles HTTP request and response logic
 * for Post related operations.
 *
 * Responsibilities:
 * - Create post
 * - Update post
 * - Fetch feed
 * - Fetch single post
 * - Delete post
 *
 * NOTE:
 * Business logic is handled in PostService.
 * Controller only validates input and formats response.
 * ------------------------------------------------
 */

export const PostController = {
  /**
   * ------------------------------------------------
   * Create Post
   * ------------------------------------------------
   * Endpoint:
   * POST /api/posts
   *
   * Middleware:
   * - authMiddleware
   * - uploadPostImages.array("images", 5)
   *
   * Request type:
   * multipart/form-data
   *
   * Body:
   * - content (string)
   * - images[] (optional)
   *
   * Flow:
   * 1. Verify authenticated user
   * 2. Extract uploaded files
   * 3. Convert file names into accessible URLs
   * 4. Send data to PostService
   * 5. Return created post
   */
  createPost: asyncHandler(async (req: Request, res: Response) => {
    /**
     * Ensure user is authenticated
     */
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const user = req.user;
    const userId = user.id;

    /**
     * Multer stores uploaded files in req.files
     */
    const files = req.files as Express.Multer.File[];

    /**
     * Construct public image URLs
     * Example result:
     * /uploads/users/wasim_31/posts/171234-image.jpg
     */
    const folder = `${user.username}_${user.id}`;

    const images =
      files?.map((file) => `/uploads/users/${folder}/posts/${file.filename}`) ||
      [];

    /**
     * Create post using PostService
     */
    const post = await PostService.createPost(userId, req.body.content, images);

    /**
     * Send standardized response
     */
    sendResponse(res, 201, "Post created successfully", post);
  }),

  /**
   * ------------------------------------------------
   * Update Post
   * ------------------------------------------------
   * Endpoint:
   * PATCH /api/posts/:id
   *
   * Only the post owner can edit the post.
   */
  updatePost: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;

    /**
     * Extract post ID from route
     */
    const postId = Number(req.params.id);

    /**
     * Update post via service
     */
    const post = await PostService.updatePost(postId, userId, req.body);

    sendResponse(res, 200, "Post updated successfully", post);
  }),

  /**
   * ------------------------------------------------
   * Get Feed
   * ------------------------------------------------
   * Endpoint:
   * GET /api/posts/feed?page=1&limit=10
   *
   * Pagination prevents loading thousands of posts.
   */
  getFeed: asyncHandler(async (req: Request, res: Response) => {
    /**
     * Read pagination query params
     */
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    /**
     * Fetch posts from service
     */
    const posts = await PostService.getFeed(page, limit);

    sendResponse(res, 200, "Feed fetched successfully", posts);
  }),

  /**
   * ------------------------------------------------
   * Get Single Post
   * ------------------------------------------------
   * Endpoint:
   * GET /api/posts/:id
   */
  getPost: asyncHandler(async (req: Request, res: Response) => {
    const postId = Number(req.params.id);

    const post = await PostService.getPostById(postId);

    sendResponse(res, 200, "Post fetched successfully", post);
  }),

  /**
   * ------------------------------------------------
   * Delete Post
   * ------------------------------------------------
   * Endpoint:
   * DELETE /api/posts/:id
   *
   * Only the post owner can delete their post.
   */
  deletePost: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const userId = req.user.id;
    const postId = Number(req.params.id);

    /**
     * Delete post via service
     */
    await PostService.deletePost(postId, userId);

    sendResponse(res, 200, "Post deleted successfully");
  }),
};
