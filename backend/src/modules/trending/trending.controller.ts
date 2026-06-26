import { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { sendResponse } from "../../shared/utils/sendResponse";
import { TrendingService } from "./trending.service";

export const TrendingController = {
  getTrendingHashtags: asyncHandler(async (req: Request, res: Response) => {
    const limit = Number(req.query.limit) || 10;
    const days = Number(req.query.days) || 2;

    const trends = await TrendingService.getTrendingHashtags(limit, days);

    sendResponse(res, 200, "Trending hashtags fetched successfully", trends);
  }),
};
