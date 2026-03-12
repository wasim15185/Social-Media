import { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { sendResponse } from "../../shared/utils/sendResponse";
import { SearchService } from "./search.service";

/**
 * Search Controller
 */

export const SearchController = {
  /**
   * Search users
   */
  searchUsers: asyncHandler(async (req: Request, res: Response) => {
    const query = String(req.query.q || "");

    const users = await SearchService.searchUsers(query);

    sendResponse(res, 200, "Users found", users);
  }),

  /**
   * Search posts
   */
  searchPosts: asyncHandler(async (req: Request, res: Response) => {
    const query = String(req.query.q || "");

    const posts = await SearchService.searchPosts(query);

    sendResponse(res, 200, "Posts found", posts);
  }),
};
